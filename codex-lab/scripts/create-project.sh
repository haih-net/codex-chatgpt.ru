#!/usr/bin/env bash
source "$(dirname -- "${BASH_SOURCE[0]}")/common.sh"
[[ $# -eq 1 ]] || fail 'Использование: scripts/create-project.sh <имя проекта>'
valid_name "$1"
project_dir="$lab_dir/projects/$1"
[[ ! -e "$project_dir" ]] || fail 'Проект уже существует. Выберите новое имя.'
shopt -s nullglob
binaries=("$lab_dir/bin/"*/codex)
default_binary='./codex'
if [[ ${#binaries[@]} -gt 0 ]]; then
  printf 'Доступные бинарники:\n'
  for binary in "${binaries[@]}"; do realpath --relative-to="$PWD" "$binary"; done
  default_binary="$(realpath --relative-to="$PWD" "${binaries[0]}")"
fi
read -r -p "Путь к бинарнику [$default_binary]: " binary || fail 'Путь не получен'
binary="$(expand_path "${binary:-$default_binary}")"
[[ -f "$binary" && -x "$binary" ]] || fail 'Не найден исполняемый бинарник'
read -r -p 'Использовать центральный файл авторизации? [Y/n]: ' use_auth || fail 'Ответ не получен'
case "${use_auth:-Y}" in
  y|Y|yes|YES)
    auth_file=''
    for candidate in "${CODEX_HOME:-$HOME/.codex}/auth.json" "$HOME/.codex/auth.json"; do
      if [[ -f "$candidate" && -r "$candidate" ]]; then auth_file="$candidate"; break; fi
    done
    if [[ -z "$auth_file" ]]; then
      read -r -p 'Путь к существующему auth.json: ' auth_file || fail 'Путь не получен'
    fi
    [[ -n "$auth_file" ]] || fail 'Путь к файлу авторизации пуст'
    auth_file="$(expand_path "$auth_file")"
    [[ -f "$auth_file" && -r "$auth_file" ]] || fail 'Файл авторизации отсутствует или недоступен';;
  n|N|no|NO) auth_file='';;
  *) fail 'Ожидается Y или n';;
esac
init_dirs
mkdir -- "$project_dir"
mkdir -p "$project_dir/workspace" "$project_dir/codex-home/log"
realpath --relative-to="$lab_dir" "$binary" > "$project_dir/codex-binary-path"
if [[ -n "$auth_file" ]]; then
  ln -s -- "$auth_file" "$project_dir/codex-home/auth.json"
fi
printf 'Проект создан: %s\n' "$project_dir"
