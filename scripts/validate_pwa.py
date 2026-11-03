#!/usr/bin/env python3
"""Validate local PWA manifest assets without adding runtime dependencies."""

import ast
import json
import re
import struct
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def fail(message: str) -> None:
    print(f"PWA validation failed: {message}", file=sys.stderr)
    raise SystemExit(1)


manifest_path = ROOT / "manifest.webmanifest"
try:
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
except (OSError, json.JSONDecodeError) as error:
    fail(f"manifest is unreadable: {error}")

if manifest.get("display") != "standalone":
    fail("manifest display mode must be standalone")
if not manifest.get("name") or not manifest.get("start_url"):
    fail("manifest must include a name and start_url")

icons = manifest.get("icons", [])
if not any(icon.get("purpose") == "maskable" for icon in icons):
    fail("manifest must include a maskable icon")
if not any(icon.get("sizes") == "192x192" for icon in icons):
    fail("manifest must include a 192×192 icon")
if not any(icon.get("sizes") == "512x512" for icon in icons):
    fail("manifest must include a 512×512 icon")

for icon in icons:
    icon_path = ROOT / icon.get("src", "")
    if not icon_path.is_file():
        fail(f"icon asset is missing: {icon.get('src')}")
    if icon.get("type") == "image/png":
        content = icon_path.read_bytes()
        if len(content) < 24 or content[:8] != b"\x89PNG\r\n\x1a\n":
            fail(f"icon is not a valid PNG: {icon_path.name}")
        width, height = struct.unpack(">II", content[16:24])
        size = icon.get("sizes", "")
        if size != "any" and size != f"{width}x{height}":
            fail(f"icon dimensions do not match its manifest size: {icon_path.name}")

html = (ROOT / "index.html").read_text(encoding="utf-8")
app = (ROOT / "app.js").read_text(encoding="utf-8")
if html.find('src="core.js"') < 0 or html.find('src="app.js"') < html.find('src="core.js"'):
    fail("core.js must load before app.js")
if 'href="manifest.webmanifest"' not in html or 'apple-touch-icon' not in html:
    fail("manifest and Apple touch icon links are required")
if not re.search(r"navigator\.serviceWorker\.register\(['\"]\./sw\.js['\"]", app):
    fail("app.js must register the project-scoped service worker")
if 'property="og:image"' not in html or 'assets/gridshift-readme-hero.png' not in html:
    fail("branded social preview metadata is required")
if not (ROOT / "assets/gridshift-readme-hero.png").is_file():
    fail("branded social preview image is missing")

try:
    package = json.loads((ROOT / "package.json").read_text(encoding="utf-8"))
    core = (ROOT / "core.js").read_text(encoding="utf-8")
    release_notes = (ROOT / "RELEASE_NOTES.md").read_text(encoding="utf-8")
except (OSError, json.JSONDecodeError) as error:
    fail(f"version metadata is unreadable: {error}")
app_version = re.search(r"const APP_VERSION = '([^']+)'", core)
if not app_version or package.get("version") != app_version.group(1):
    fail("package.json version must match the visible app version in core.js")
if f"## {package.get('version')} " not in release_notes:
    fail("release notes must include the current package version")

for resource in ["index.html", "styles.css", "core.js", "app.js", "manifest.webmanifest"]:
    if not (ROOT / resource).is_file():
        fail(f"app shell resource is missing: {resource}")

try:
    worker = (ROOT / "sw.js").read_text(encoding="utf-8")
    pages_builder = ast.parse((ROOT / "scripts/build_pages.py").read_text(encoding="utf-8"))
except (OSError, SyntaxError) as error:
    fail(f"service worker or Pages builder is unreadable: {error}")

precache_files = []
core_files = []
for list_name in ("CORE_FILES", "OPTIONAL_FILES"):
    match = re.search(rf"const {list_name} = \[(.*?)\];", worker, re.DOTALL)
    if not match:
        fail(f"service worker is missing its {list_name} list")
    listed_files = re.findall(r"'([^']+)'", match.group(1))
    if list_name == "CORE_FILES":
        core_files = listed_files
    precache_files.extend(listed_files)

required_core = {"./", "./index.html", "./styles.css", "./core.js", "./app.js", "./manifest.webmanifest", "./icon.svg"}
if not required_core.issubset(core_files):
    fail("service-worker CORE_FILES must include the complete required app shell")

# The worker itself is registered by the app, but is not part of its own cache lists.
precache_files.append("./sw.js")

for source in precache_files:
    relative = "index.html" if source == "./" else source.removeprefix("./")
    if not (ROOT / relative).is_file():
        fail(f"service-worker precache asset is missing: {source}")

pages_files = None
for node in pages_builder.body:
    if isinstance(node, ast.Assign) and any(
        isinstance(target, ast.Name) and target.id == "FILES" for target in node.targets
    ):
        try:
            pages_files = set(ast.literal_eval(node.value))
        except (ValueError, TypeError):
            fail("Pages builder FILES must be a literal tuple or list")
        break
if pages_files is None:
    fail("Pages builder must define a literal FILES allowlist")

missing_from_pages = sorted({
    "index.html" if source == "./" else source.removeprefix("./")
    for source in precache_files
} - pages_files)
if missing_from_pages:
    fail("Pages allowlist omits service-worker precache assets: " + ", ".join(missing_from_pages))

print("PWA assets, install icons, social metadata, version references, worker registration, core shell, and Pages precache coverage are valid.")
