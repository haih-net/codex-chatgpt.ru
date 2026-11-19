#!/usr/bin/env bash
source "$(dirname -- "${BASH_SOURCE[0]}")/common.sh"
[[ $# -ge 1 && $# -le 2 ]] || fail 'Использование: scripts/clone.sh <имя> [ветка, тег или commit]'
valid_name "$1"
init_dirs
clone_dir="$lab_dir/repos/$1"
[[ ! -e "$clone_dir" ]] || fail "Каталог уже существует: $clone_dir"
git clone https://github.com/openai/codex.git "$clone_dir"
if [[ $# -eq 2 ]]; then
  git -C "$clone_dir" switch --detach "$2"
fi
git -C "$clone_dir" switch -c local-experiment
printf 'Клон: %s\nРевизия: ' "$clone_dir"
git -C "$clone_dir" rev-parse HEAD
