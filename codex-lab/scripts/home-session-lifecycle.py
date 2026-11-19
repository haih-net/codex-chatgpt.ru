#!/usr/bin/env python3
"""Замеры подготовки CODEX_HOME и продолжения сессии штатного Codex."""
import argparse
import copy
import datetime
import json
import os
from pathlib import Path
import queue
import re
import signal
import subprocess
import threading
import time
import tomllib

LAB = Path(__file__).resolve().parents[1]
PROJECT = LAB / 'projects/home-session-lifecycle'
ARTIFACTS = PROJECT / 'artifacts'
WORKSPACE = PROJECT / 'workspace'
AUTH = Path.home() / '.codex/auth.json'
MODEL = 'gpt-6-astra'
SECOND_MODEL = 'gpt-5.6-sol'
PROMPT = 'Не используй инструменты. Ответь только: ОК.'
REMEMBER = 'Запомни кодовое слово КЕДР. Не используй инструменты. Ответь только: ОК.'
RECALL = 'Какое кодовое слово я попросил запомнить? Ответь только этим словом.'
TRACE_ENV = 'codex_http_client::transport=trace,codex_models_manager=info'


def save(path, value):
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')


def snapshot(home):
    result = {}
    for p in sorted(home.rglob('*')):
        name = str(p.relative_to(home))
        if p.is_symlink():
            result[name] = {'type': 'symlink', 'target': os.readlink(p)}
        elif p.is_dir():
            result[name] = {'type': 'directory'}
        elif p.is_file():
            st = p.stat()
            result[name] = {'type': 'file', 'bytes': st.st_size, 'mtime_ns': st.st_mtime_ns}
    return result


def source_catalog():
    return json.loads((LAB / 'projects/minimal-context/codex-home/models_cache.json').read_text())


def catalog(minimal):
    models = [copy.deepcopy(m) for m in source_catalog()['models'] if m['slug'] in (MODEL, SECOND_MODEL)]
    if minimal:
        for m in models:
            m.update(tool_mode='direct', multi_agent_version='disabled', experimental_supported_tools=[], apply_patch_tool_type=None)
    return {'models': models}


def config(home, minimal=False, static=False, bundled=False):
    result = f'''model = "{MODEL}"
model_reasoning_effort = "medium"
cli_auth_credentials_store = "file"
model_provider = "experiment-http"
'''
    if static:
        result += f'model_catalog_json = {json.dumps(str(home / "model-catalog.json"))}\n'
    if minimal:
        previous = (LAB / 'projects/minimal-context/artifacts/catalog-http-final.config.toml').read_text()
        settings = previous.split('instructions = ""', 1)[1].split('[model_providers.', 1)[0]
        result += 'instructions = ""' + settings
        if not bundled:
            result += '\n[skills.bundled]\nenabled = false\n'
    result += '''
[model_providers.experiment-http]
name = "OpenAI"
base_url = "https://chatgpt.com/backend-api/codex"
wire_api = "responses"
requires_openai_auth = true
supports_websockets = false
'''
    return result


def cli_overrides(text):
    result = []
    def visit(prefix, value):
        if isinstance(value, dict):
            for key, item in value.items():
                visit(f'{prefix}.{key}' if prefix else key, item)
        else:
            result.extend(['-c', f'{prefix}={json.dumps(value, ensure_ascii=False)}'])
    visit('', tomllib.loads(text))
    return result


def prepare(name, variant, cache=None):
    home = PROJECT / 'homes' / name
    home.mkdir(parents=True, exist_ok=False)
    (home / 'auth.json').symlink_to(AUTH)
    if variant in ('cache', 'invalid-cache', 'stale-cache'):
        value = copy.deepcopy(cache)
        if variant == 'invalid-cache':
            value = {'models': value['models']}
        if variant == 'stale-cache':
            value['fetched_at'] = '2000-01-01T00:00:00Z'
        save(home / 'models_cache.json', value)
    static = variant in ('static', 'minimal-previous', 'minimal', 'minimal-cli')
    minimal = variant in ('minimal-previous', 'minimal', 'minimal-cli')
    if static:
        save(home / 'model-catalog.json', catalog(minimal))
    text = config(home, minimal, static, bundled=variant == 'minimal-previous')
    if variant == 'minimal':
        (home / 'config.toml').write_text(text)
        overrides = []
    else:
        overrides = cli_overrides(text)
    return home, overrides


def trace_requests(log):
    result = []
    for line in log.splitlines():
        if line.startswith('{'):
            try:
                entry = json.loads(line)
                line = f"{entry['timestamp']} {entry.get('fields', {}).get('message', '')}"
            except (KeyError, json.JSONDecodeError):
                continue
        match = re.search(r'(\d{4}-\d\d-\d\dT[^ ]+Z).*?POST to ([^ ]+): (\{.*)$', line)
        if match and match[2].split("?")[0].endswith("/responses"):
            try:
                body = json.loads(match[3])
                stamp = datetime.datetime.fromisoformat(match[1].replace('Z', '+00:00')).timestamp()
            except (ValueError, json.JSONDecodeError):
                continue
            result.append({'at': stamp, 'url': match[2], 'body': body, 'bytes': len(match[3].encode())})
    return result


def filesystem_summary(text):
    lines = text.splitlines()
    directories = [line for line in lines if 'getdents64(' in line]
    return {'trace_lines': len(lines), 'directory_reads': len(directories),
            'skill_directory_reads': sum('/skills' in line for line in directories),
            'plugin_directory_reads': sum('/plugins' in line for line in directories),
            'skill_file_opens': sum('openat(' in line and 'SKILL.md' in line for line in lines),
            'skill_file_reads': sum('openat(' in line and 'SKILL.md' in line and 'O_RDONLY' in line for line in lines),
            'skill_file_writes': sum('openat(' in line and 'SKILL.md' in line and 'O_WRONLY' in line for line in lines),
            'agents_probes': sum('AGENTS.md' in line for line in lines)}


def summarize(run, started, ended, home, before, events, exit_code):
    after = snapshot(home)
    save(run / 'after.json', after)
    log = (run / 'stderr.log').read_text(errors='replace')
    requests = trace_requests(log)
    save(run / 'requests.json', requests)
    summary = {'label': run.name, 'home': str(home), 'exit_code': exit_code,
               'wall_seconds': ended - started,
               'first_request_seconds': requests[0]['at'] - started if requests else None,
               'requests': [{'model': r['body'].get('model'), 'reasoning': r['body'].get('reasoning'),
                             'input_count': len(r['body'].get('input', [])), 'configuration_updates': [item for item in r['body'].get('input', []) if item.get('type') == 'configuration_update'], 'bytes': r['bytes']} for r in requests],
               'models_gets': len(re.findall(r'GET to .*?/models\?', log)),
               'cache_messages': [line for line in log.splitlines() if 'models cache:' in line or 'failed to load models cache' in line],
               'before_files': sum(v['type'] != 'directory' for v in before.values()),
               'after_files': sum(v['type'] != 'directory' for v in after.values()),
               'created': sorted(set(after) - set(before)),
               'changed': sorted(k for k in set(before) & set(after) if before[k] != after[k]),
               'fs': filesystem_summary((run / 'filesystem.trace').read_text(errors='replace')),
               'thread_id': next((e['thread_id'] for e in events if e.get('type') == 'thread.started'), None),
               'answers': [e['item']['text'] for e in events if e.get('item', {}).get('type') == 'agent_message'],
               'usage': next((e['usage'] for e in events if e.get('type') == 'turn.completed'), None)}
    save(run / 'summary.json', summary)
    print(json.dumps({k: summary[k] for k in ('label', 'exit_code', 'wall_seconds', 'first_request_seconds', 'models_gets', 'before_files', 'after_files', 'answers', 'fs')}, ensure_ascii=False), flush=True)
    return summary


def exec_run(binary, label, home, overrides, prompt=PROMPT, session=None, model=MODEL, effort='medium', traced=True):
    run = ARTIFACTS / label
    run.mkdir(exist_ok=False)
    before = snapshot(home)
    save(run / 'before.json', before)
    command = [str(binary), '-C', str(WORKSPACE), *overrides, '-m', model, '-c', f'model_reasoning_effort="{effort}"', 'exec']
    if session:
        command += ['resume', '--json', session, prompt]
    else:
        command += ['--json', prompt]
    save(run / 'command.json', command)
    if traced:
        command = ['strace', '-f', '-ttt', '-yy', '-s', '512', '-e', 'trace=%file,getdents64', '-o', str(run / 'filesystem.trace'), *command]
    else:
        (run / 'filesystem.trace').write_text('')
    env = dict(os.environ, CODEX_HOME=str(home), RUST_LOG=TRACE_ENV)
    started = time.time()
    with (run / 'stdout.jsonl').open('w') as stdout, (run / 'stderr.log').open('w') as stderr:
        process = subprocess.Popen(command, env=env, stdin=subprocess.DEVNULL, stdout=stdout, stderr=stderr, start_new_session=True)
        try:
            code = process.wait(timeout=180)
        except subprocess.TimeoutExpired:
            os.killpg(process.pid, signal.SIGTERM)
            code = process.wait(timeout=10)
    ended = time.time()
    events = [json.loads(line) for line in (run / 'stdout.jsonl').read_text().splitlines() if line.startswith('{')]
    return summarize(run, started, ended, home, before, events, code)


def startup(binary):
    missing = PROJECT / 'homes/absent'
    exec_run(binary, '00-missing-home', missing, cli_overrides(config(missing)))
    home, overrides = prepare('cold', 'cold')
    exec_run(binary, '01-cold', home, overrides)
    cache = json.loads((home / 'models_cache.json').read_text())
    save(ARTIFACTS / 'fresh-cache-seed.json', cache)
    exec_run(binary, '02-warm-new-session', home, overrides)
    for number, variant in enumerate(('cache', 'invalid-cache', 'stale-cache', 'static', 'minimal-previous', 'minimal', 'minimal-cli'), start=3):
        target, options = prepare(variant, variant, cache)
        exec_run(binary, f'{number:02d}-{variant}', target, options)


def resume(binary, minimal=True):
    prefix = 'resume' if minimal else 'resume-default'
    home, options = prepare(prefix, 'minimal' if minimal else 'cold')
    first = exec_run(binary, f'{prefix}-01-first', home, options, REMEMBER)
    session = first['thread_id']
    if not session:
        raise RuntimeError('Первый запуск не вернул session id')
    sequence = [(MODEL, 'medium'), (MODEL, 'high'), (MODEL, 'xhigh'), (SECOND_MODEL, 'high'), (MODEL, 'medium')]
    if not minimal:
        sequence = [(MODEL, 'medium'), (MODEL, 'medium')]
    for i, (model, effort) in enumerate(sequence, start=2):
        result = exec_run(binary, f'{prefix}-{i:02d}-{model}-{effort}', home, options, RECALL, session, model, effort)
        if result['exit_code'] or not result['usage']:
            raise RuntimeError(f'Не завершён ход {result["label"]}')
    for i in range(2 if minimal else 0):
        exec_run(binary, f'untraced-resume-{i+1}', home, options, RECALL, session, traced=False)


def live(binary, minimal=True):
    prefix = 'live' if minimal else 'live-default'
    home, options = prepare(prefix, 'minimal' if minimal else 'cold')
    run = ARTIFACTS / f'{prefix}-process'
    run.mkdir(exist_ok=False)
    before = snapshot(home)
    save(run / 'before.json', before)
    cmd = [str(binary), '-C', str(WORKSPACE), *options, 'app-server', '--stdio']
    save(run / 'command.json', cmd)
    cmd = ['strace', '-f', '-ttt', '-yy', '-s', '512', '-e', 'trace=%file,getdents64', '-o', str(run / 'filesystem.trace'), *cmd]
    messages = queue.Queue()
    events = []
    started = time.time()
    with (run / 'stderr.log').open('w') as stderr, (run / 'protocol.jsonl').open('w') as protocol:
        proc = subprocess.Popen(cmd, env=dict(os.environ, CODEX_HOME=str(home), RUST_LOG=TRACE_ENV), stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=stderr, text=True, bufsize=1, start_new_session=True)
        def reader():
            for line in proc.stdout:
                try:
                    message = json.loads(line)
                except json.JSONDecodeError:
                    continue
                stamp = time.time()
                events.append({'at': stamp, 'message': message})
                protocol.write(json.dumps({'at': stamp, 'direction': 'received', 'message': message}, ensure_ascii=False) + '\n')
                protocol.flush()
                messages.put(message)
        thread = threading.Thread(target=reader, daemon=True)
        thread.start()
        next_id = 0
        def send(message):
            protocol.write(json.dumps({'at': time.time(), 'direction': 'sent', 'message': message}, ensure_ascii=False) + '\n')
            protocol.flush()
            proc.stdin.write(json.dumps(message, ensure_ascii=False) + '\n')
            proc.stdin.flush()
        def wait_for(predicate):
            deadline = time.monotonic() + 180
            while time.monotonic() < deadline:
                message = messages.get(timeout=max(0.1, deadline-time.monotonic()))
                if 'method' in message and 'id' in message:
                    send({'id': message['id'], 'error': {'code': -32601, 'message': 'В опыте инструменты клиента не используются'}})
                if predicate(message):
                    return message
            raise TimeoutError('Нет ожидаемого ответа app-server')
        def request(method, params):
            nonlocal next_id
            next_id += 1
            message_id = next_id
            send({'id': message_id, 'method': method, 'params': params})
            reply = wait_for(lambda m: m.get('id') == message_id and ('result' in m or 'error' in m))
            if 'error' in reply:
                raise RuntimeError(reply['error'])
            return reply['result']
        measurements = []
        try:
            request('initialize', {'clientInfo': {'name': 'home_session_lab', 'title': 'Лаборатория CODEX_HOME', 'version': '1.0'}, 'capabilities': {'experimentalApi': True}})
            send({'method': 'initialized', 'params': {}})
            initialized = time.time()
            reply = request('thread/start', {'model': MODEL, 'cwd': str(WORKSPACE), 'approvalPolicy': 'never', 'sandbox': 'read-only'})
            thread_ready = time.time()
            thread_id = reply['thread']['id']
            save(run / 'thread-start.json', reply)
            sequence = [(MODEL, 'medium', REMEMBER), (MODEL, 'medium', RECALL), (MODEL, 'high', RECALL), (MODEL, 'xhigh', RECALL), (SECOND_MODEL, 'high', RECALL), (MODEL, 'medium', RECALL)]
            if not minimal:
                sequence = [(MODEL, 'medium', REMEMBER), (MODEL, 'medium', RECALL), (MODEL, 'medium', RECALL)]
            for index, (model, effort, prompt) in enumerate(sequence, start=1):
                begin = time.time()
                result = request('turn/start', {'threadId': thread_id, 'model': model, 'effort': effort, 'input': [{'type': 'text', 'text': prompt}]})
                turn_id = result['turn']['id']
                complete = wait_for(lambda m: m.get('method') == 'turn/completed' and m['params']['turn']['id'] == turn_id)
                end = time.time()
                measurements.append({'index': index, 'model': model, 'effort': effort, 'started': begin, 'ended': end, 'seconds': end-begin, 'turn_id': turn_id, 'status': complete['params']['turn']['status']})
                save(run / 'turns.json', measurements)
                print(json.dumps(measurements[-1]), flush=True)
            save(run / 'timing.json', {'started': started, 'initialized': initialized, 'thread_ready': thread_ready, 'thread_id': thread_id, 'turns': measurements})
        finally:
            proc.stdin.close()
            try:
                proc.wait(timeout=15)
            except subprocess.TimeoutExpired:
                os.killpg(proc.pid, signal.SIGTERM)
                proc.wait(timeout=10)
            thread.join(timeout=5)
    summary = summarize(run, started, time.time(), home, before, [], proc.returncode)
    save(run / 'events.json', events)


def portable_template(binary):
    home, options = prepare('portable-template-test', 'minimal')
    path = home / 'config.toml'
    path.write_text(path.read_text().replace(json.dumps(str(home / 'model-catalog.json')), json.dumps('model-catalog.json')))
    result = exec_run(binary, '10-portable-template', home, options)
    if result['exit_code']:
        raise RuntimeError('Переносимая заготовка не прошла проверку')
    template = PROJECT / 'template'
    template.mkdir(exist_ok=False)
    for name in ('config.toml', 'model-catalog.json'):
        (template / name).write_bytes((home / name).read_bytes())
    (template / 'auth.json').symlink_to(AUTH)
    save(ARTIFACTS / 'template-manifest.json', snapshot(template))


def main():
    global PROJECT, ARTIFACTS, WORKSPACE
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('phase', choices=['startup', 'resume', 'live', 'resume-default', 'live-default', 'template', 'all'])
    parser.add_argument('--binary', default='home-session-stock')
    parser.add_argument('--project', default='home-session-lifecycle')
    args = parser.parse_args()
    if not re.fullmatch(r'[a-zA-Z0-9_-]+', args.project):
        parser.error('Недопустимое имя проекта')
    PROJECT = LAB / 'projects' / args.project
    ARTIFACTS = PROJECT / 'artifacts'
    WORKSPACE = PROJECT / 'workspace'
    ARTIFACTS.mkdir(parents=True, exist_ok=True)
    binary = LAB / 'bin' / args.binary / 'codex'
    if not binary.exists():
        parser.error(f'Нет сборки {binary}')
    WORKSPACE.mkdir(exist_ok=True)
    if not (WORKSPACE / '.git').exists():
        subprocess.run(['git', 'init', '-q', str(WORKSPACE)], check=True)
    (ARTIFACTS / 'build-info.txt').write_text((binary.parent / 'build-info.txt').read_text())
    for name, fn in [('startup', startup), ('resume-default', lambda b: resume(b, False)), ('resume', resume), ('live', live), ('live-default', lambda b: live(b, False)), ('template', portable_template)]:
        if args.phase in (name, 'all'):
            fn(binary)


if __name__ == '__main__':
    main()
