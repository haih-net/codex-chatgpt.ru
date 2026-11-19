#!/usr/bin/env python3
"""Сводка сохранённых запусков; не отправляет запросы к модели."""
import argparse
import importlib.util
import json
from pathlib import Path
import re

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--project', default='home-session-lifecycle')
args = parser.parse_args()
if not re.fullmatch(r'[a-zA-Z0-9_-]+', args.project):
    parser.error('Недопустимое имя проекта')
spec = importlib.util.spec_from_file_location('experiment', Path(__file__).with_name('home-session-lifecycle.py'))
experiment = importlib.util.module_from_spec(spec)
spec.loader.exec_module(experiment)
project = experiment.LAB / 'projects' / args.project
artifacts = project / 'artifacts'
results = {}


def interval_lines(lines, start, end):
    result = []
    for line in lines:
        match = re.search(r'\b(\d{10}\.\d+)\s', line)
        if match and start <= float(match[1]) <= end:
            result.append(line)
    return '\n'.join(result)


for path in sorted(artifacts.glob('*/summary.json')):
    run = path.parent
    data = json.loads(path.read_text())
    log = (run / 'stderr.log').read_text(errors='replace')
    requests = experiment.trace_requests(log)
    experiment.save(run / 'requests.json', requests)
    lines = (run / 'filesystem.trace').read_text(errors='replace').splitlines()
    data['fs'] = experiment.filesystem_summary('\n'.join(lines))
    if requests:
        data['fs_before_first_request'] = experiment.filesystem_summary(interval_lines(lines, 0, requests[0]['at']))
    data['requests'] = []
    for r in requests:
        body = r['body']
        items = body.get('input', [])
        data['requests'].append({'at': r['at'], 'bytes': r['bytes'], 'model': body.get('model'),
                                 'reasoning': body.get('reasoning'), 'input_count': len(items),
                                 'roles': [item.get('role') for item in items],
                                 'configuration_updates': [item for item in items if item.get('type') == 'configuration_update'],
                                 'has_tools': bool(body.get('tools')) or any(item.get('type') == 'additional_tools' for item in items)})
    if (run / 'timing.json').exists():
        timing = json.loads((run / 'timing.json').read_text())
        events = [json.loads(line) for line in (run / 'protocol.jsonl').read_text().splitlines()]
        data['thread_id'] = timing['thread_id']
        data['first_request_seconds'] = requests[0]['at'] - timing['started'] if requests else None
        data['process_to_initialize'] = timing['initialized'] - timing['started']
        data['process_to_thread_ready'] = timing['thread_ready'] - timing['started']
        data['turns'] = []
        for turn in timing['turns']:
            selected = [r for r in data['requests'] if turn['started'] <= r['at'] <= turn['ended']]
            messages = [e['message'] for e in events if e['message'].get('params', {}).get('turnId') == turn['turn_id']]
            answers = [m['params']['item']['text'] for m in messages if m.get('method') == 'item/completed' and m['params']['item'].get('type') == 'agentMessage']
            usages = [m['params']['tokenUsage']['last'] for m in messages if m.get('method') == 'thread/tokenUsage/updated']
            row = {**turn, 'first_request_seconds': selected[0]['at'] - turn['started'] if selected else None,
                   'requests': selected, 'answers': answers, 'usage': usages[-1] if usages else None,
                   'fs': experiment.filesystem_summary(interval_lines(lines, turn['started'], turn['ended']))}
            if selected:
                row['fs_before_request'] = experiment.filesystem_summary(interval_lines(lines, turn['started'], selected[0]['at']))
            assert turn['status'] == 'completed'
            assert selected and selected[0]['model'] == turn['model']
            updates = selected[0]['configuration_updates']
            effective_effort = updates[-1]['reasoning']['effort'] if updates else selected[0]['reasoning']['effort']
            row['effective_effort'] = effective_effort
            assert effective_effort == turn['effort']
            if turn['index'] > 1:
                assert answers == ['КЕДР'], answers
            data['turns'].append(row)
    elif run.name != '00-missing-home':
        assert data['exit_code'] == 0 and data['usage'], run.name
        if 'resume' in run.name and 'first' not in run.name:
            assert data['answers'] == ['КЕДР'], (run.name, data['answers'])
    results[run.name] = data
    experiment.save(run / 'analysis.json', data)

for prefix in ('resume-', 'resume-default-'):
    subset = [v for k, v in results.items() if re.match(re.escape(prefix) + r'\d', k)]
    assert len({v['thread_id'] for v in subset}) == 1
for label in ('08-minimal', '09-minimal-cli', '10-portable-template', 'live-process'):
    if label in results:
        item = results[label]
        assert item['models_gets'] == 0 and item['fs']['skill_file_opens'] == 0
        assert all(not r['has_tools'] for r in item['requests'])
experiment.save(project / 'results.json', {'source_revision': '727283cea5ba30e8cf8bbac6b68a03a4d91cf1b7',
                                          'build_info': (artifacts / 'build-info.txt').read_text(), 'runs': results})
for key, value in results.items():
    print(key, 'before_api=', round(value['first_request_seconds'], 3) if value['first_request_seconds'] is not None else None,
          'total=', round(value['wall_seconds'], 3), 'models_GET=', value['models_gets'],
          'skill_reads=', value['fs']['skill_file_reads'])
    for turn in value.get('turns', []):
        print('  turn', turn['index'], turn['model'], turn['effort'],
              round(turn['first_request_seconds'], 3), round(turn['seconds'], 3), turn['answers'])
