#!/usr/bin/env python3
"""Повторение опыта с отдельным проектом и записью запросов экспериментальной сборки."""
import argparse
import json
import os
from pathlib import Path
import subprocess

lab = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('variant', choices=['baseline', 'instructions', 'configured', 'catalog', 'hardcoded'])
parser.add_argument('--binary', default='minimal-context-final')
parser.add_argument('--label')
parser.add_argument('--http', action='store_true', help='Проверить HTTP вместо WebSocket')
args = parser.parse_args()
project = lab / 'projects/minimal-context'
artifacts = project / 'artifacts'
artifacts.mkdir(exist_ok=True)
label = args.label or args.variant
if not label.replace('-', '').replace('_', '').isalnum():
    parser.error('Метка должна состоять из букв, цифр, дефиса и подчёркивания')
output = artifacts / label
if output.with_suffix('.requests.jsonl').exists() or output.with_suffix('.stdout.jsonl').exists():
    parser.error('Результат с такой меткой уже существует')
catalog = project / 'model-catalog.json'
if not catalog.exists():
    cache = json.loads((project / 'codex-home/models_cache.json').read_text())
    model = next(model for model in cache['models'] if model['slug'] == 'gpt-6-astra')
    catalog.write_text(json.dumps({'models': [model]}, ensure_ascii=False, indent=2) + '\n')
if args.variant in ('catalog', 'hardcoded'):
    model = json.loads(catalog.read_text())['models'][0]
    model.update(tool_mode='direct', multi_agent_version='disabled',
                 experimental_supported_tools=[], apply_patch_tool_type=None)
    if args.http and args.variant == 'hardcoded':
        model['use_responses_lite'] = False
    catalog = project / 'model-catalog.minimal.json'
    catalog.write_text(json.dumps({'models': [model]}, ensure_ascii=False, indent=2) + '\n')
config = f'''model = "gpt-6-astra"
model_catalog_json = {json.dumps(str(catalog))}
model_reasoning_effort = "medium"
'''
if args.http:
    config += 'model_provider = "experiment-http"\n'
if args.variant != 'baseline':
    config += 'instructions = ""\ndeveloper_instructions = ""\n'
if args.variant in ('configured', 'catalog', 'hardcoded'):
    config += '''include_permissions_instructions = false
include_collaboration_mode_instructions = false
include_apps_instructions = false
include_environment_context = false
include_environment_context_time = false
project_doc_max_bytes = 0
web_search = "disabled"
[tools.experimental_request_user_input]
enabled = false
[skills]
include_instructions = false
[features]
goals = false
image_generation = false
shell_tool = false
view_image = false
sleep_tool = false
code_mode = false
code_mode_only = false
multi_agent = false
multi_agent_v2 = false
apps = false
plugins = false
recommended_plugins = false
tool_suggest = false
tool_search = false
search_tool = false
apply_patch_freeform = false
skip_host_skill_discovery = true
'''
if args.http:
    config += '''
[model_providers.experiment-http]
name = "OpenAI"
base_url = "https://chatgpt.com/backend-api/codex"
wire_api = "responses"
requires_openai_auth = true
supports_websockets = false
'''
(project / 'codex-home/config.toml').write_text(config)
output.with_suffix('.config.toml').write_text(config)
binary = lab / 'bin' / args.binary / 'codex'
if not binary.is_file():
    parser.error(f'Нет сборки {binary}')
(project / 'codex-binary-path').write_text(str(binary.relative_to(lab)) + '\n')
env = dict(os.environ, CODEX_EXPERIMENT_REQUEST_LOG=str(output.with_suffix('.requests.jsonl')),
           CODEX_EXPERIMENT_MINIMAL_CONTEXT='1' if args.variant == 'hardcoded' else '0')
command = [str(lab / 'scripts/run-codex.sh'), 'minimal-context', 'exec', '--json', 'Ответь только числом: 2 + 2.']
with output.with_suffix('.stdout.jsonl').open('w') as stdout, output.with_suffix('.stderr.log').open('w') as stderr:
    result = subprocess.run(command, env=env, stdin=subprocess.DEVNULL, stdout=stdout, stderr=stderr)
events = [json.loads(line) for line in output.with_suffix('.stdout.jsonl').read_text().splitlines() if line.startswith('{')]
summary = {'variant': args.variant, 'binary': args.binary, 'exit_code': result.returncode,
           'usage': next((event['usage'] for event in events if event['type'] == 'turn.completed'), None),
           'build_info': (binary.parent / 'build-info.txt').read_text(),
           'answers': [event['item']['text'] for event in events if event.get('item', {}).get('type') == 'agent_message']}
requests = output.with_suffix('.requests.jsonl')
if requests.exists():
    summary['requests'] = []
    for line in requests.read_text().splitlines():
        record = json.loads(line)
        body = record['body']
        assert json.loads(record['wire_json']) == body
        assert len(record['wire_json'].encode()) == record['bytes']
        summary['requests'].append({'bytes': record['bytes'], 'transport': record['transport'],
                                    'fields': sorted(body), 'warmup': body.get('generate') is False,
                                    'input': [{'type': item.get('type', 'message'), 'role': item.get('role')} for item in body.get('input', [])],
                                    'has_tools': bool(body.get('tools')) or any(item.get('type') == 'additional_tools' for item in body.get('input', []))})
output.with_suffix('.summary.json').write_text(json.dumps(summary, ensure_ascii=False, indent=2) + '\n')
print(json.dumps(summary, ensure_ascii=False))
raise SystemExit(result.returncode)
