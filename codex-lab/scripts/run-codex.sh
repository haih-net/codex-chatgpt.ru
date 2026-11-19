#!/usr/bin/env bash
source "$(dirname -- "${BASH_SOURCE[0]}")/common.sh"
[[ $# -ge 1 ]] || fail 'Использование: scripts/run-codex.sh <проект> [аргументы Codex]'
valid_name "$1"
project_dir="$lab_dir/projects/$1"
shift
[[ -f "$project_dir/codex-binary-path" ]] || fail 'Проект не настроен'
IFS= read -r codex_bin < "$project_dir/codex-binary-path"
# Старые проекты с абсолютным путём также поддерживаются.
if [[ "$codex_bin" != /* ]]; then
  codex_bin="$lab_dir/$codex_bin"
fi
[[ -f "$codex_bin" && -x "$codex_bin" ]] || fail "Не найден исполняемый файл Codex по абсолютному пути: $codex_bin"
if [[ -L "$project_dir/codex-home/auth.json" && ! -f "$project_dir/codex-home/auth.json" ]]; then
  fail 'Симлинк авторизации указывает на отсутствующий файл'
fi
cd "$project_dir"
# TOML-строки должны экранировать обратную косую черту и кавычки в пути.
log_dir="$project_dir/codex-home/log"
log_dir="${log_dir//\\/\\\\}"
log_dir="${log_dir//\"/\\\"}"
exec env CODEX_HOME="$project_dir/codex-home" "$codex_bin" \
  -c 'cli_auth_credentials_store="file"' \
  -c "log_dir=\"$log_dir\"" \
  -C "$project_dir/workspace" "$@"
