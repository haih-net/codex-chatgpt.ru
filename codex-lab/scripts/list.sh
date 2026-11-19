#!/usr/bin/env bash
source "$(dirname -- "${BASH_SOURCE[0]}")/common.sh"
[[ $# -eq 1 ]] || fail 'Использование: scripts/list.sh repos|binaries|projects'
shopt -s nullglob
case "$1" in
  repos)
    for dir in "$lab_dir/repos/"*/; do
      printf '\n%s\n' "$(basename "$dir")"
      git -C "$dir" log -1 --format='%h %cs %s'
      git -C "$dir" status --short --branch
    done;;
  binaries)
    for dir in "$lab_dir/bin/"*/; do
      printf '\n%s\n' "$(basename "$dir")"
      cat "$dir/build-info.txt"
    done;;
  projects)
    for dir in "$lab_dir/projects/"*/; do
      printf '\n%s\nБинарник: ' "$(basename "$dir")"
      cat "$dir/codex-binary-path"
      if [[ -L "$dir/codex-home/auth.json" ]]; then
        printf 'Авторизация: %s\n' "$(readlink "$dir/codex-home/auth.json")"
      else
        printf 'Авторизация: отдельная\n'
      fi
    done;;
  *) fail 'Ожидается repos, binaries или projects';;
esac
