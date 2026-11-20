#!/usr/bin/env python3
"""Сквозной опыт: внешний вход, история, сжатие, resume и дочерние агенты."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import queue
import re
import signal
import sqlite3
import subprocess
import threading
import time
import traceback

LAB = Path(__file__).resolve().parents[1]
MODEL = 'gpt-6-astra'
TRACE = 'codex_http_client::transport=trace,codex_core::compact=debug,codex_core::compact_remote_v2=debug,codex_otel.agent_communication=info,codex_core::session::turn_input=trace'


def save(path, data):
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')


def snapshot(home, dest):
    dest.mkdir(exist_ok=False)
    files = {}
    for path in sorted(home.rglob('*')):
        if not path.is_file() or path.is_symlink():
            continue
        rel = str(path.relative_to(home))
        files[rel] = {'bytes': path.stat().st_size}
        if path.suffix == '.jsonl':
            data = path.read_bytes()
            files[rel]['sha256'] = hashlib.sha256(data).hexdigest()
            target = dest / rel
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(data)
    save(dest / 'files.json', files)
    # Онлайн backup согласован с SQLite WAL, без копирования авторизации.
    for path in home.glob('*.sqlite'):
        with sqlite3.connect(f'file:{path}?mode=ro', uri=True) as src:
            with sqlite3.connect(dest / path.name) as target:
                src.backup(target)
    return files


class Client:
    def __init__(self, binary, home, workspace, run):
        run.mkdir(exist_ok=False)
        self.run, self.home = run, home
        self.lock = threading.Lock()
        self.events, self.pending = [], []
        self.queue = queue.Queue()
        self.seq = 0
        self.protocol = (run / 'protocol.jsonl').open('w')
        self.stderr = (run / 'stderr.log').open('w')
        cmd = [str(binary), '-C', str(workspace), 'app-server', '--stdio']
        save(run / 'command.json', cmd)
        self.record('external', {'event': 'process_spawn', 'command': cmd})
        self.proc = subprocess.Popen(
            ['strace', '-f', '-ttt', '-yy', '-s', '256', '-e', 'trace=%file',
             '-o', str(run / 'filesystem.trace'), *cmd],
            env=dict(os.environ, CODEX_HOME=str(home), RUST_LOG=TRACE),
            stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=self.stderr,
            text=True, bufsize=1, start_new_session=True)
        self.reader = threading.Thread(target=self.read, daemon=True)
        self.reader.start()
        self.request('initialize', {'clientInfo': {'name': 'context_lifecycle_lab', 'version': '1.0'},
                                    'capabilities': {'experimentalApi': True}})
        self.send({'method': 'initialized', 'params': {}})

    def record(self, direction, message):
        with self.lock:
            event = {'at_ns': time.time_ns(), 'monotonic_ns': time.monotonic_ns(),
                     'direction': direction, 'message': message}
            self.events.append(event)
            self.protocol.write(json.dumps(event, ensure_ascii=False) + '\n')
            self.protocol.flush()

    def read(self):
        for line in self.proc.stdout:
            try:
                msg = json.loads(line)
            except ValueError:
                continue
            self.record('received', msg)
            self.queue.put(msg)
        self.queue.put({'reader_eof': True})

    def send(self, msg):
        self.record('sent', msg)
        self.proc.stdin.write(json.dumps(msg, ensure_ascii=False) + '\n')
        self.proc.stdin.flush()

    def wait(self, predicate, timeout=240):
        for i, msg in enumerate(self.pending):
            if predicate(msg):
                return self.pending.pop(i)
        deadline = time.monotonic() + timeout
        while time.monotonic() < deadline:
            msg = self.queue.get(timeout=max(.1, deadline - time.monotonic()))
            if msg.get('reader_eof'):
                raise RuntimeError('app-server завершился до ожидаемого события')
            if 'method' in msg and 'id' in msg:
                self.send({'id': msg['id'], 'error': {'code': -32601, 'message': 'Клиентские инструменты в опыте не используются'}})
            if predicate(msg):
                return msg
            self.pending.append(msg)
        raise TimeoutError('Не пришло ожидаемое событие')

    def request(self, method, params):
        self.seq += 1
        seq = self.seq
        self.send({'id': seq, 'method': method, 'params': params})
        msg = self.wait(lambda m: m.get('id') == seq and ('result' in m or 'error' in m))
        if 'error' in msg:
            raise RuntimeError(msg['error'])
        return msg['result']

    def turn(self, tid, text, label):
        self.record('external', {'event': 'message_received', 'origin': 'user', 'label': label, 'text': text})
        result = self.request('turn/start', {'threadId': tid, 'input': [{'type': 'text', 'text': text}],
                              'clientUserMessageId': label, 'turnTrigger': 'experiment-user'})
        turn_id = result['turn']['id']
        complete = self.wait(lambda m: m.get('method') == 'turn/completed'
                             and m['params']['turn']['id'] == turn_id)
        save(self.run / f'{label}.json', complete)
        print(json.dumps({'phase': label, 'turn_id': turn_id, 'status': complete['params']['turn']['status']}), flush=True)
        if complete['params']['turn']['status'] != 'completed':
            raise RuntimeError(complete)
        self.record('external', {'event': 'turn_delivered', 'turn_id': turn_id, 'label': label})
        snapshot(self.home, self.run / f'snapshot-{label}')
        return turn_id

    def close(self):
        self.proc.stdin.close()
        try:
            self.proc.wait(timeout=15)
        except subprocess.TimeoutExpired:
            os.killpg(self.proc.pid, signal.SIGTERM)
            self.proc.wait(timeout=15)
        self.reader.join(timeout=5)
        self.record('external', {'event': 'process_exit', 'code': self.proc.returncode})
        self.stderr.close()
        self.protocol.close()
        requests = []
        for line in (self.run / 'stderr.log').read_text().splitlines():
            if line.startswith('{'):
                try:
                    entry = json.loads(line)
                    line = str(entry.get('timestamp', '')) + ' ' + entry.get('fields', {}).get('message', '')
                except (ValueError, TypeError):
                    continue
            match = re.search(r'POST to ([^ ]+): (\{.*)$', line)
            if match:
                try:
                    requests.append({'url': match[1], 'body': json.loads(match[2]), 'trace_prefix': line[:match.start()]})
                except ValueError:
                    pass
        save(self.run / 'requests.json', requests)


def prepare(project, mode):
    home = project / 'home'
    home.mkdir()
    (home / 'auth.json').symlink_to(Path.home() / '.codex/auth.json')
    template = LAB / 'projects/home-session-lifecycle/template'
    config = (template / 'config.toml').read_text()
    config = 'model_post_turn_compact_threshold_percent = 0\n' + config
    catalog = json.loads((template / 'model-catalog.json').read_text())
    if mode == 'auto':
        config = 'model_auto_compact_token_limit = 1600\n' + config
    if mode == 'local':
        config += '\n[model_providers.experiment-http.capabilities]\nremote_compaction = "unsupported"\n'
    if mode == 'agents':
        config = config.replace('multi_agent = false', 'multi_agent = true').replace('multi_agent_v2 = false', 'multi_agent_v2 = true')
        config = config.replace('sleep_tool = false', 'sleep_tool = true')
        for m in catalog['models']:
            m['multi_agent_version'] = 'v2'
    (home / 'config.toml').write_text(config)
    save(home / 'model-catalog.json', catalog)
    (project / 'workspace').mkdir()
    return home


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('mode', choices=['manual', 'auto', 'local', 'agents', 'cli'])
    parser.add_argument('--name')
    parser.add_argument('--binary', default='context-lifecycle-stock')
    args = parser.parse_args()
    project = LAB / 'projects' / (args.name or f'context-lifecycle-{args.mode}')
    project.mkdir(exist_ok=False)
    binary = LAB / 'bin' / args.binary / 'codex'
    save(project / 'manifest.json', {'mode': args.mode, 'created_at_ns': time.time_ns(),
         'binary': str(binary), 'build_info': (binary.parent / 'build-info.txt').read_text(),
         'binary_sha256': hashlib.sha256(binary.read_bytes()).hexdigest()})
    home = prepare(project, args.mode)
    client = None
    try:
        if args.mode == 'cli':
            for phase in ['first', 'resume']:
                prompt = 'Запомни маркер CLI-КЕДР-17. Ответь только ОК.' if phase == 'first' else 'Какой маркер запомнил? Ответь только им.'
                cmd = [str(binary), '-C', str(project / 'workspace'), 'exec']
                if phase == 'resume':
                    cmd += ['resume', tid]
                cmd += ['--json', prompt]
                save(project / f'{phase}-input.json', {'at_ns': time.time_ns(), 'origin': 'user', 'command': cmd, 'text': prompt})
                with (project / f'{phase}-stdout.jsonl').open('w') as out, (project / f'{phase}-stderr.log').open('w') as err:
                    result = subprocess.run(cmd, env=dict(os.environ, CODEX_HOME=str(home), RUST_LOG=TRACE), stdout=out, stderr=err, timeout=180)
                if result.returncode:
                    raise RuntimeError(f'CLI exit {result.returncode}')
                rows = [json.loads(l) for l in (project / f'{phase}-stdout.jsonl').read_text().splitlines()]
                if phase == 'first':
                    tid = next(r['thread_id'] for r in rows if r['type'] == 'thread.started')
                snapshot(home, project / f'snapshot-{phase}')
            return
        client = Client(binary, home, project / 'workspace', project / '01-live')
        start = client.request('thread/start', {'model': MODEL, 'cwd': str(project / 'workspace'), 'approvalPolicy': 'never', 'sandbox': 'read-only'})
        tid = start['thread']['id']
        save(project / 'thread.json', start)
        snapshot(home, project / '01-live/snapshot-before-message')
        if args.mode == 'agents':
            client.turn(tid, 'Это эксперимент жизненного цикла. Создай двух дочерних агентов через spawn_agent с task_name alpha и beta и fork_turns none. Каждому поручение: подожди 8 секунд доступным инструментом sleep, затем верни соответственно ALPHA-17 или BETA-29. Запусти обоих до ожидания результатов, дождись обоих через wait_agent, затем ответь обоими маркерами. Других задач и изменений файлов не выполняй.', 'parallel-agents')
        else:
            prompt = 'Запомни код КЕДР-7319 и цвет янтарный. Не используй инструменты. Ответь только ОК.'
            client.turn(tid, prompt, 'first')
            client.turn(tid, 'Какой код и цвет? Ответь одной строкой.', 'live-second')
            if args.mode == 'auto':
                filler = '\n'.join(f'Запись {i}: экспериментальные временные данные, значение {i * 179}.' for i in range(180))
                client.turn(tid, 'Прочитай временные данные ниже. После прочтения ответь только ОК. Сохраняй код и цвет.\n' + filler, 'large-input')
                client.turn(tid, 'Какой код и цвет были в начале? Ответь кратко.', 'auto-recall')
            else:
                client.record('external', {'event': 'manual_compaction_requested'})
                client.request('thread/compact/start', {'threadId': tid})
                compact = client.wait(lambda m: m.get('method') == 'turn/completed' and m['params']['threadId'] == tid)
                save(project / 'manual-complete.json', compact)
                snapshot(home, project / '01-live/snapshot-compact-installed')
                client.turn(tid, 'Какой код и цвет были в начале? Ответь кратко.', 'after-compact')
        client.close()
        client = None
        snapshot(home, project / 'snapshot-stopped')
        if args.mode != 'agents':
            client = Client(binary, home, project / 'workspace', project / '02-resume')
            restored = client.request('thread/resume', {'threadId': tid})
            save(project / 'resume.json', restored)
            snapshot(home, project / '02-resume/snapshot-restored')
            client.turn(tid, 'После перезапуска назови исходный код и цвет. Ответь кратко.', 'resumed-recall')
    except Exception:
        (project / 'error.log').write_text(traceback.format_exc())
        raise
    finally:
        if client:
            client.close()
        snapshot(home, project / 'snapshot-final')


if __name__ == '__main__':
    main()
