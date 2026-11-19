#!/usr/bin/env python3
"""Собрать Code Mode host с настройкой V8 из выбранного клона Codex."""

import os
from pathlib import Path
import subprocess
import sys


def main() -> None:
    clone_dir = Path(sys.argv[1]).resolve()
    target_dir = Path(sys.argv[2]).resolve()
    environment = os.environ.copy()
    helper = clone_dir / "scripts/codex_package/v8.py"
    if helper.is_file():
        # Используем штатную загрузку V8 и проверку SHA256 из этой ревизии.
        os.environ["CODEX_REPO_ROOT"] = str(clone_dir)
        sys.path.insert(0, str(clone_dir / "scripts"))
        from codex_package.targets import TARGET_SPECS
        from codex_package.v8 import resolve_codex_v8_cargo_env

        rust_version = subprocess.check_output(["rustc", "-vV"], text=True)
        host = next(
            line.removeprefix("host: ")
            for line in rust_version.splitlines()
            if line.startswith("host: ")
        )
        environment.update(resolve_codex_v8_cargo_env(TARGET_SPECS[host]))
    subprocess.run(
        [
            "cargo", "build", "--locked", "--release",
            "--bin", "codex-code-mode-host", "--target-dir", str(target_dir),
        ],
        cwd=clone_dir / "codex-rs",
        env=environment,
        check=True,
    )


if __name__ == "__main__":
    main()
