# Release notes

## 0.2.3 — explicitly unreviewed release candidate

- Disclose that pages on the planned `boredpolymath.github.io` host share the browser storage origin, and warn against storing confidential records there unless all same-origin publishers are trusted.
- Bump the app version to 0.2.3 and the service-worker cache to v8 so installed users can receive the updated privacy guidance through the user-controlled update flow.
- Record the owner decision about retaining the shared Pages origin or moving to a dedicated hostname as an open release gate.

This is not a published release. Owner review of the newly disclosed origin-sharing risk, detailed browser records, live Pages checks, and final release approval remain open.

## 0.2.2 — explicitly unreviewed release candidate

- Make the absence of independent power-system engineering and climate/accounting review prominent on every app screen and in scenario-results CSV exports.
- Revise the owner-approved launch criteria to permit public release with the model explicitly labeled unreviewed; retain exploratory-use boundaries and require qualified review before operational, investment, or regulatory decisions.
- Bump the service-worker cache to v7 for the current disclosure, contrast, and user-controlled update changes.
- Keep a waiting update action visible after navigating between screens, until the user accepts it.
- Wrap long workspace names and stack planning panels at tablet widths to prevent horizontal page overflow.
- Improve contrast for table headings, screening notices, source links, metric icons, the breadcrumb separator, and mobile inventory Remove actions after local seven-screen desktop and mobile probes.
- Keep Reports within narrow mobile viewports for large supported-range values by wrapping metric values, stacking report cards, and sizing cumulative-chart axes from their labels; verified all seven screens at five viewport widths with synthetic boundary inputs.
- Build and validate the exact allowlisted Pages artifact in both quality CI and deployment, rejecting missing, extra, modified, or symbolic-link assets before publication.

This is not a published release. Utility-user feedback, detailed browser records, live Pages deployment checks, and final release-owner approval remain open.

## 0.2.1 — release-readiness work in progress

- Treat an unknown replacement technology residual value as incomplete lifecycle cost data; enter zero to explicitly state there is no residual credit.
- Migrate ambiguous legacy residual-value zeroes to unknown and flag saved scenario snapshots for review.
- Add dialog focus restoration, including a page-heading fallback when an action replaces its invoking control.
- Add public-release social-card metadata and package the branded preview image in the GitHub Pages artifact.
- Bump the service-worker cache so users can receive this app and calculation update through the user-controlled update flow.
- Add a separate Decimal-based arithmetic check for the reviewer packet examples and run it in CI before deploy.

This is not a published release. Independent domain review, utility-user review, browser testing, and production hosting checks remain open.

## 0.2.0 — release-readiness work in progress

- Corrected new-project SF₆ GWP₁₀₀ default to 24,300 and linked the official IPCC AR6 WGI supplementary table.
- Preserved old scenario calculations while marking legacy factor and ambiguous zero-cost inputs for review.
- Kept blank cost inputs unknown, reported missing cost categories as partial, and fixed the final-year residual value boundary.
- Added complete backup preview and deeper nested record validation, CSV limits/validation, spreadsheet formula escaping, and damaged-storage recovery.
- Added mobile access to project switching and data tools, site/scenario deletion, keyboard state labels, and update/install UI.
- Added raster and maskable PWA icons, an explicit versioned service-worker update flow, core regression tests, and CI checks.
- Added [CALCULATION_MODEL.md](CALCULATION_MODEL.md), [RELEASE_READINESS_CHECKLIST.md](RELEASE_READINESS_CHECKLIST.md), and [RELEASE_RUNBOOK.md](RELEASE_RUNBOOK.md).

This is not a published release. Domain approval, accessibility/browser testing, production hosting, and the release-owner sign-off are still required.

## Release preparation

- Added a GitHub Pages workflow for the public project site and a minimal, explicit static artifact builder.
- Bounded imported scenario snapshot assumptions and added a calculator guard against unsupported horizons.
- Added a reviewer packet with independent hand-check examples and a browser/device session record.
- Documented the GitHub Pages response-header limitation and the accepted launch risk.
