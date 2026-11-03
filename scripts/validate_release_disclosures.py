#!/usr/bin/env python3
"""Guard the approved explicitly-unreviewed public release disclosures."""

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
REQUIRED = {
    "app.js": [
        "const MODEL_REVIEW_STATUS = 'Not independently reviewed';",
        "function reviewStatusNotice()",
        "el.innerHTML=reviewStatusNotice()+(views[page]||dashboard)(p)",
        "['model review status','','independent domain review',MODEL_REVIEW_STATUS",
        "No independent qualified power-system engineering or climate/accounting review has been completed",
        "Browser extensions with permission to access this site may inspect or change site data or displayed records",
        "Downloaded JSON backups contain readable project data, are not encrypted by Gridshift",
        "any other page on that exact host shares this storage origin and can read, change, or delete Gridshift data",
        "Do not store confidential utility records there unless every publisher on the host is trusted",
    ],
    "README.md": [
        "Independent review status: not independently reviewed.",
        "Browser extensions granted access to this site may read or change site data or page content",
        "Downloaded JSON backups contain readable project data, are not encrypted by Gridshift",
        "Other pages on that exact host share the browser storage origin even when their URL paths differ.",
        "Do not store confidential utility records on the planned host unless every publisher and page on that origin is trusted",
    ],
    "CALCULATION_MODEL.md": [
        "No independent qualified power-system engineering or climate/accounting review has been completed."
    ],
    "SECURITY.md": [
        "Browser extensions granted access to the site can inspect or alter site content",
        "The JSON backup is readable and is not encrypted by Gridshift",
        "Any other page published on `boredpolymath.github.io` can read, change, or delete Gridshift's localStorage data",
        "A dedicated Gridshift hostname is required for origin isolation; disclosure alone does not prevent same-origin access",
    ],
    "RELEASE_REVIEW_PACKET.md": [
        "Domain review is not a public-launch gate under this revised criterion.",
        "Bored Polymath Studios accepted retaining the planned shared GitHub Pages origin on 2026-11-03",
        "do not store confidential utility records on the shared origin unless every publisher on it is trusted",
    ],
}


def main() -> None:
    missing = [
        f"{path}: missing required disclosure marker {marker!r}"
        for path, markers in REQUIRED.items()
        for content in [Path(ROOT, path).read_text(encoding="utf-8")]
        for marker in markers
        if marker not in content
    ]
    if missing:
        raise SystemExit("Release disclosure validation failed:\n- " + "\n- ".join(missing))
    print("Unreviewed-status, local-data, extension, backup, and shared-origin disclosures are present in the app and release documents.")


if __name__ == "__main__":
    main()
