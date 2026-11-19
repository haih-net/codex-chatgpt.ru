#!/usr/bin/env bash
source "$(dirname -- "${BASH_SOURCE[0]}")/common.sh"
[[ $# -eq 2 ]] || fail 'Использование: scripts/build.sh <имя клона или путь> <имя новой сборки>'
valid_name "$2"
init_dirs
clone_dir="$lab_dir/repos/$1"
[[ -d "$clone_dir" ]] || clone_dir="$1"
clone_dir="$(expand_path "$clone_dir")"
[[ -f "$clone_dir/codex-rs/Cargo.toml" ]] || fail 'В клоне нет codex-rs/Cargo.toml'
output_dir="$lab_dir/bin/$2"
[[ ! -e "$output_dir" ]] || fail 'Сборка с таким именем уже есть. Выберите новое имя.'
command -v cargo >/dev/null || fail 'Cargo не найден. Выполните source "$HOME/.cargo/env".'
# Блокировка действует до завершения сборки и копирования.
exec 9>"$lab_dir/target/.codex-build.lock"
flock 9
[[ ! -e "$output_dir" ]] || fail 'Сборка с таким именем уже есть.'
cd "$clone_dir/codex-rs"
# Фиксируем ревизию и локальные изменения, с которыми начинается сборка.
revision="$(git rev-parse HEAD)"
state="$(git status --porcelain)"
cargo build --locked --release --bin codex --target-dir "$lab_dir/target"
# В новых ревизиях Code Mode запускается отдельной программой рядом с CLI.
with_code_mode_host=false
if [[ -f code-mode-host/Cargo.toml ]]; then
  python3 "$lab_dir/scripts/build-code-mode-host.py" "$clone_dir" "$lab_dir/target"
  with_code_mode_host=true
fi
# Сначала копируем во временный файл рядом с назначением.
# При ошибке сборки или копирования прежний бинарник остаётся на месте.
staging="$(mktemp -d "$lab_dir/bin/.build.XXXXXX")"
trap 'rm -rf -- "$staging"' EXIT
cp -- "$lab_dir/target/release/codex" "$staging/codex"
chmod +x "$staging/codex"
if [[ "$with_code_mode_host" == true ]]; then
  cp -- "$lab_dir/target/release/codex-code-mode-host" "$staging/codex-code-mode-host"
  chmod +x "$staging/codex-code-mode-host"
fi
{
  printf 'Клон: %s\nCommit: %s\nДата UTC: %s\n' "$clone_dir" "$revision" "$(date -u +%FT%TZ)"
  printf 'Состояние Git перед сборкой:\n%s\n' "${state:-чисто}"
  "$staging/codex" --version
  rustc --version
  printf 'Code Mode host: %s\n' "$with_code_mode_host"
  if [[ "$with_code_mode_host" == true ]]; then
    sha256sum "$staging/codex-code-mode-host" | awk '{print "Host SHA256: " $1}'
  fi
  sha256sum "$staging/codex" | awk '{print "SHA256: " $1}'
} > "$staging/build-info.txt"
mv -T -- "$staging" "$output_dir"
trap - EXIT
printf 'Готовый бинарник: %s/codex\n' "$output_dir"
