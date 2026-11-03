# Static release runbook

This runbook targets a public GitHub Pages project site at `https://boredpolymath.github.io/Gridshift/`. GitHub reports PR #1 merged on 2026-11-03, so remote `main` now contains the Pages and quality workflows. Repository metadata reports Pages disabled (`has_pages: false`); the main-branch Pages run failed at `configure-pages` and skipped deployment. The quality run failed because the release-disclosure validator still expected the old pending host-decision text; the validator has been corrected in the local worktree, but that correction has not been published. The available web tool could not open the Pages URL, so its HTTP status is not established. Do not treat the app as deployed.

## Before publishing

1. Confirm the release owner has approved the audience, exploratory-use boundary, calculation model, and release acceptance criteria.
2. Confirm the app, README, calculation model, and scenario-results CSV disclose that no independent qualified power-system or climate/accounting review has been completed. Under the owner's revised criteria, this disclosure is required and domain review is not a public-launch gate; qualified review is still required before operational, investment, or regulatory use.
3. Run the GitHub Actions quality workflow and resolve failures.
   The workflow builds `_site` and checks that it contains exactly the allowlisted files, byte-identical to their sources, before considering the change valid.
4. Run the manual smoke checks below on the supported browser/device matrix.
5. Review the release notes and confirm the version in `package.json` and `core.js` agree.
6. Export and restore representative test workspaces. Never use real customer records in test fixtures or public issues.
7. Confirm the product owner accepts the local-storage, shared-device, browser-extension, readable-backup, and same-origin Pages disclosures in README and Settings. The planned `boredpolymath.github.io/Gridshift/` project path does not isolate localStorage from other pages on that host. Use a dedicated hostname for actual origin isolation; owner acceptance of disclosure alone does not prevent access by same-origin pages.

## GitHub Pages setup and hosting limits

- Enabling GitHub Actions as the Pages source makes each subsequent push to `main` publish the app publicly. Bored Polymath Studios accepted the shared-origin storage exposure on 2026-11-03; keep its warning visible and do not store confidential utility records on that origin unless every publisher is trusted. Do not enable this source until the remaining launch gates are complete and the owner explicitly approves the initial public deployment.
- In repository Settings → Pages, choose **GitHub Actions** as the build and deployment source. The workflow publishes only the static app shell from `_site` when `main` is updated. See GitHub's [custom workflow guide](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
- The project site is served under `/Gridshift/`, not at the host root. Manifest, script, style, icon, and service worker references are relative so they resolve within this project path. Verify the complete path after the first deployment.
- GitHub Pages project paths under `boredpolymath.github.io` share one browser origin. A script on another page at that host can access Gridshift localStorage if the user visits it in the same profile. The path-based project site is not a security boundary. Prefer a dedicated custom hostname; if retaining the shared host, require trusted control over every published page there and warn users not to store confidential utility records.
- GitHub Pages provides HTTPS. Confirm the live URL redirects or serves securely before inviting users.
- Serve `manifest.webmanifest` as `application/manifest+json` (or a browser-recognized JSON MIME type) and `sw.js` as `text/javascript` or `application/javascript`.
- Serve `sw.js` and `index.html` with revalidation enabled (`Cache-Control: no-cache` is suitable). Avoid long-lived immutable caching for the worker script.
- Keep all files listed in the service worker's required shell in the same deployment. Publish a complete revision atomically so clients cannot receive a partial app shell.
- Preserve the HTML Content Security Policy and ensure it permits same-origin scripts, styles, images, and the same-origin service worker.
- GitHub Pages does not provide per-response-header configuration in this repository workflow. GitHub's [Pages header discussion](https://github.com/orgs/community/discussions/54257) confirms custom headers are not supported. The HTML meta CSP cannot set `frame-ancestors`; response headers such as `X-Content-Type-Options` and `Permissions-Policy` cannot be added by this app. Treat this as an accepted launch limitation, inspect the actual headers after deployment, and reconsider hosting if policy requires those headers.
- GitHub's [Pages data-collection notice](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages#data-collection) says visitor IP addresses are logged and stored for security. The Pages documentation does not specify a retention period. Bored Polymath Studios accepts this as GitHub hosting behavior; Gridshift itself does not transmit planning records or send analytics. Keep the disclosure in README and review GitHub's [Privacy Statement](https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement) if its policy changes.

## Manual smoke checks

- [ ] New browser profile: create a project and verify all six planning screens and Settings load.
- [ ] Import the CSV template, edit records, create more than one scenario, compare the scenario tiles, and export inventory/results.
- [ ] Download a JSON backup, restore it into an empty profile, verify the preview counts, then exercise cancel, separate-copy, and replace flows.
- [ ] Use keyboard-only navigation for project switching, More on mobile, dialogs, forms, confirmations, chart/table switch, and export controls.
- [ ] Test 320 px wide through desktop widths, zoom, long project/asset names, empty states, and large but supported inventories.
- [ ] Install from the browser and verify the app name/icon on supported platforms.
- [ ] With the worker active, go offline, launch the app, navigate, edit saved data, and export; verify the expected behavior for an uncached request.
- [ ] Publish a staging update and verify the previous shell remains coherent until the user chooses the update button, then reload and verify local data remains.
- [ ] Repeat install/offline/update checks on current and previous major desktop Chrome, Edge, Firefox, Safari, current iOS/iPadOS Safari, and Android Chrome.
- [ ] Verify local storage denied, full, corrupted, and cleared states; verify another tab changing or clearing data does not silently overwrite the visible workspace.

## Rollback

1. Retain the exact source revision and complete static artifact for each published release.
2. To roll back, atomically publish the previous full revision at the root and allow the service-worker update check to discover it.
3. Verify the update prompt, activate the prior shell, and confirm backups and local project data remain intact.
4. If any data migration is not backward-compatible, stop rollback and use a version-specific recovery plan before asking users to open the older app.

Do not tag or announce a release until the owner-approved disclosure criteria, CI, Pages deployment, response-header review, and manual platform checks are complete. No domain approval may be implied; a release without that review must remain explicitly labeled unreviewed.
