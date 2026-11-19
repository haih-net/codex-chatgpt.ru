#!/usr/bin/env bash
set -euo pipefail
lab_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
fail() { printf 'Ошибка: %s\n' "$*" >&2; exit 1; }
valid_name() { [[ "$1" =~ ^[a-zA-Z0-9][a-zA-Z0-9._-]*$ ]] || fail "Недопустимое имя: $1"; }
init_dirs() { mkdir -p "$lab_dir"/{repos,target,bin,projects}; }
expand_path() {
  local value="$1"
  case "$value" in '~') value="$HOME";; '~/'*) value="$HOME/${value:2}";; esac
  realpath -e -- "$value"
}
