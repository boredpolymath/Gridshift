"""Assemble the minimal static shell published to GitHub Pages."""
from pathlib import Path
import shutil

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "_site"
FILES = (
    "index.html",
    "styles.css",
    "core.js",
    "app.js",
    "sw.js",
    "manifest.webmanifest",
    "icon.svg",
    "icons/gridshift-192.png",
    "icons/gridshift-512.png",
    "icons/gridshift-maskable-512.png",
    "assets/gridshift-mark.svg",
    "assets/gridshift-readme-hero.png",
)

if OUTPUT.exists():
    shutil.rmtree(OUTPUT)
for relative in FILES:
    source = ROOT / relative
    if not source.is_file():
        raise SystemExit(f"Required Pages asset is missing: {relative}")
    target = OUTPUT / relative
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source, target)

print(f"Built GitHub Pages shell in {OUTPUT}")
