#!/usr/bin/env python3
"""Сводка наблюдений; исходные журналы остаются неизменными."""
import argparse
import datetime
from collections import Counter
import hashlib
import json
import re
from pathlib import Path
import sqlite3

LAB = Path(__file__).resolve().parents[1]


def rows(path):
    return [json.loads(line) for line in path.read_text().splitlines() if line.strip()]


def text(item):
    return '\n'.join(c.get('text', '') for c in item.get('content', []) if isinstance(c, dict))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('project')
    parser.add_argument('--verify', action='store_true', help='Завершиться с ошибкой, если наблюдения не подтверждены')
    args = parser.parse_args()
    project = LAB / 'projects' / args.project
    report = {'project': args.project, 'rollouts': [], 'snapshots': [], 'requests': [], 'protocol': [], 'sqlite': {}}
    for path in sorted((project / 'home').rglob('*.jsonl')):
        data = rows(path)
        summary = {'path': str(path.relative_to(project)), 'bytes': path.stat().st_size,
                   'records': len(data), 'counts': dict(Counter(r['type'] for r in data)),
                   'meta': data[0].get('payload'), 'compactions': [], 'messages': [], 'turns': [], 'communications': []}
        # Не дублируем длинные инструкции в сводке.
        summary['meta'] = {k: v for k, v in summary['meta'].items() if k not in ('base_instructions',)}
        for line, row in enumerate(data, 1):
            p = row.get('payload', {})
            if row['type'] == 'compacted':
                history = p.get('replacement_history') or []
                summary['compactions'].append({'line': line, 'timestamp': row['timestamp'],
                    'window_id': p.get('window_id'), 'previous_window_id': p.get('previous_window_id'),
                    'window_number': p.get('window_number'), 'replacement_count': len(history),
                    'replacement_types': [i.get('type') for i in history],
                    'encrypted_items': sum(bool(i.get('encrypted_content')) for i in history),
                    'summary_text': p.get('message', '')})
            if row['type'] == 'response_item' and p.get('type') in ('message', 'agent_message'):
                summary['messages'].append({'line': line, 'timestamp': row['timestamp'], 'type': p['type'], 'role': p.get('role'),
                    'text': text(p), 'id': p.get('id')})
            if row['type'] == 'event_msg' and p.get('type') in ('task_started', 'task_complete', 'turn_aborted'):
                summary['turns'].append({'line': line, 'timestamp': row['timestamp'], **p})
            if 'inter_agent' in row['type']:
                summary['communications'].append({'line': line, 'timestamp': row['timestamp'], 'type': row['type'], 'payload': p})
        report['rollouts'].append(summary)
    snapshot_dirs = sorted({p.parent for p in project.rglob('files.json') if 'snapshot' in str(p)})
    for snap in snapshot_dirs:
        files = []
        for path in snap.rglob('*.jsonl'):
            rel = path.relative_to(snap)
            final = project / 'home' / rel
            data = path.read_bytes()
            files.append({'path': str(rel), 'bytes': len(data), 'records': len(data.splitlines()),
                'sha256': hashlib.sha256(data).hexdigest(),
                'unchanged_prefix_of_final': final.exists() and final.read_bytes().startswith(data)})
        report['snapshots'].append({'snapshot': str(snap.relative_to(project)), 'rollouts': files})
    # CLI пишет такой же штатный HTTP trace, но не имеет отдельного RPC-процесса.
    for log in sorted(project.glob('*-stderr.log')):
        requests = []
        for line in log.read_text().splitlines():
            match = re.search(r'POST to ([^ ]+): (\{.*)$', line)
            if match:
                try:
                    requests.append({'url': match[1], 'body': json.loads(match[2])})
                except ValueError:
                    pass
        (project / (log.stem.replace('-stderr', '') + '-requests.json')).write_text(json.dumps(requests, ensure_ascii=False, indent=2) + '\n')
    request_paths = sorted([*project.glob('*/requests.json'), *project.glob('*-requests.json')])
    for path in request_paths:
        requests = json.loads(path.read_text())
        for index, req in enumerate(requests):
            body = req['body']
            inp = body.get('input', [])
            report['requests'].append({'run': path.parent.name if path.name == 'requests.json' else path.stem, 'index': index, 'url': req['url'],
                'model': body.get('model'), 'input_types': [i.get('type') for i in inp],
                'input_items': len(inp), 'body_bytes': len(json.dumps(body).encode()),
                'compaction_trigger': any(i.get('type') == 'compaction_trigger' for i in inp),
                'compaction_checkpoint': any(i.get('type') in ('compaction', 'context_compaction') for i in inp),
                'user_texts': [text(i) for i in inp if i.get('role') == 'user']})
    for path in sorted(project.glob('*/protocol.jsonl')):
        events = rows(path)
        report['protocol'].append({'run': path.parent.name, 'events': len(events),
            'methods': dict(Counter(e['message'].get('method', e['message'].get('event', 'reply')) for e in events)),
            'errors': [e['message'] for e in events if 'error' in e['message'] or e['message'].get('method') == 'error']})
        # Каждый внешний текст отдельно сопоставляется с сохранённой user-записью.
        inputs = [e for e in events if e['direction'] == 'external' and e['message'].get('event') == 'message_received']
        for e in inputs:
            original = e['message']['text']
            matching = [{'path': r['path'], 'line': m['line']} for r in report['rollouts'] for m in r['messages']
                        if m['role'] == 'user' and m['text'] == original]
            report['protocol'][-1].setdefault('input_matches', []).append({'label': e['message']['label'], 'exact_matches': matching})
    for path in sorted(project.glob('*-input.json')):
        original = json.loads(path.read_text())['text']
        matches = [{'path': r['path'], 'line': m['line']} for r in report['rollouts'] for m in r['messages'] if m['role'] == 'user' and m['text'] == original]
        report['protocol'].append({'run': path.stem, 'events': 0, 'errors': [], 'input_matches': [{'label': path.stem, 'exact_matches': matches}]})
    for path in (project / 'snapshot-final').glob('*.sqlite'):
        with sqlite3.connect(f'file:{path}?mode=ro', uri=True) as db:
            tables = [r[0] for r in db.execute("SELECT name FROM sqlite_master WHERE type='table'")]
            report['sqlite'][path.name] = {name: db.execute('SELECT count(*) FROM "' + name.replace('"', '""') + '"').fetchone()[0] for name in tables}
    inputs = [i for p in report['protocol'] for i in p.get('input_matches', [])]
    report['verification'] = {
        'run_completed_without_runner_error': not (project / 'error.log').exists(),
        'has_rollouts': bool(report['rollouts']),
        'has_model_requests': bool(report['requests']),
        'all_input_texts_preserved': bool(inputs) and all(i['exact_matches'] for i in inputs),
        'all_snapshot_prefixes_preserved': bool(snapshot_dirs) and all(f['unchanged_prefix_of_final'] for s in report['snapshots'] for f in s['rollouts']),
    }
    mode = json.loads((project / 'manifest.json').read_text())['mode']
    if mode in ('manual', 'auto', 'local'):
        report['verification']['has_compaction'] = any(r['compactions'] for r in report['rollouts'])
        start_path, resume_path = project / 'thread.json', project / 'resume.json'
        report['verification']['resumed_same_thread'] = (start_path.exists() and resume_path.exists() and json.loads(start_path.read_text())['thread']['id'] == json.loads(resume_path.read_text())['thread']['id'])
        report['verification']['has_request_after_resume'] = any(r['run'] == '02-resume' for r in report['requests'])
        if mode != 'local':
            report['verification']['remote_trigger_observed'] = any(r['compaction_trigger'] for r in report['requests'])
            report['verification']['checkpoint_reused_after_resume'] = any(r['run'] == '02-resume' and r['compaction_checkpoint'] for r in report['requests'])
    if mode == 'agents':
        children = [r for r in report['rollouts'] if r['meta'].get('parent_thread_id')]
        intervals = []
        for child in children:
            starts = [t for t in child['turns'] if t['type'] == 'task_started']
            ends = [t for t in child['turns'] if t['type'] == 'task_complete']
            if starts and ends:
                intervals.append(tuple(datetime.datetime.fromisoformat(t['timestamp'].replace('Z', '+00:00')).timestamp() for t in (starts[0], ends[-1])))
        overlap = min(i[1] for i in intervals) - max(i[0] for i in intervals) if len(intervals) == 2 else 0
        report['child_turn_overlap_seconds'] = round(overlap, 3)
        report['verification']['two_children_overlap'] = len(children) == 2 and overlap > 0
    (project / 'analysis.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'project': args.project, 'rollouts': len(report['rollouts']),
        'compactions': sum(len(r['compactions']) for r in report['rollouts']),
        'requests': len(report['requests']),
        'all_snapshots_preserved': all(f['unchanged_prefix_of_final'] for s in report['snapshots'] for f in s['rollouts'])}, ensure_ascii=False))

    if args.verify and not all(report['verification'].values()):
        raise SystemExit('Не подтверждены: ' + ', '.join(k for k, v in report['verification'].items() if not v))


if __name__ == '__main__':
    main()
