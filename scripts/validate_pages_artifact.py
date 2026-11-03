#!/usr/bin/env python3
"""Check that the Pages artifact is exactly the intended static app shell."""

from pathlib import Path
import ast
import sys

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "_site"

def fail(message: str) -> None:
    print(f"Pages artifact validation failed: {message}", file=sys.stderr)
    raise SystemExit(1)


if not OUTPUT.is_dir():
    fail("_site is missing; run scripts/build_pages.py first")

try:
    builder_ast = ast.parse((ROOT / "scripts/build_pages.py").read_text(encoding="utf-8"))
except (OSError, SyntaxError) as error:
    fail(f"Pages builder is unreadable: {error}")

FILES = None
for node in builder_ast.body:
    if isinstance(node, ast.Assign) and any(
        isinstance(target, ast.Name) and target.id == "FILES" for target in node.targets
    ):
        try:
            FILES = set(ast.literal_eval(node.value))
        except (ValueError, TypeError):
            fail("Pages builder FILES must be a literal list or tuple")
        break
if FILES is None or not FILES:
    fail("Pages builder must define a non-empty literal FILES allowlist")

actual_files = set()
for path in OUTPUT.rglob("*"):
    if path.is_symlink():
        fail(f"artifact contains a symbolic link: {path.relative_to(OUTPUT)}")
    if path.is_file():
        actual_files.add(path.relative_to(OUTPUT).as_posix())

missing = sorted(FILES - actual_files)
unexpected = sorted(actual_files - FILES)
if missing:
    fail("required files are missing: " + ", ".join(missing))
if unexpected:
    fail("unexpected files would be published: " + ", ".join(unexpected))

for relative in sorted(FILES):
    source = ROOT / relative
    artifact = OUTPUT / relative
    if not source.is_file():
        fail(f"source asset is missing: {relative}")
    if source.read_bytes() != artifact.read_bytes():
        fail(f"artifact differs from its source: {relative}")

print(f"Pages artifact is complete and contains exactly {len(FILES)} allowlisted source files.")
