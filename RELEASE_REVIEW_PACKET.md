# Gridshift release review packet

Use this packet to record review and test evidence. The release owner has approved public release without independent domain review, provided the product is conspicuously labeled unreviewed and remains limited to exploratory use. This packet is not evidence that a reviewer has approved the model or the product.

## Review record

- Reviewer name and organization:
- Review area: power-system engineering / climate accounting / utility workflow / accessibility / browser testing
- Date:
- App version:
- Browser and version (if applicable):
- Device and operating system (if applicable):
- Decision: approved / approved with changes / not approved
- Evidence, comments, and follow-up issues:

## Calculation hand-check

Use these inputs to reproduce a known result independently.
The arithmetic is also checked by `scripts/verify_hand_checks.py`; this does not constitute power-system or climate/accounting approval.

### Continued operation

- Base year: 2026
- Horizon: 2 years
- SF₆ GWP₁₀₀: 24,300 kg CO₂e/kg SF₆
- One asset loses 1 kg SF₆ per year
- Annual operating cost: $100; annual maintenance cost: $50; currency: USD; price year: 2026
- Expected annual baseline emissions: `1 × 24,300 = 24,300 kg CO₂e`
- Expected two-year baseline emissions: `48,600 kg CO₂e`
- Annual O&M: $150; discount rate: 0%
- Expected baseline net present cost: `$300`

### Replacement in the first year

Keep the baseline inputs above, then add a replacement in 2026:

- Remaining gas at replacement: 10 kg
- Recovery efficiency: 90%
- Unrecovered end-of-life gas: `10 × (1 − 0.90) = 1 kg SF₆`
- Replacement technology annual emissions: 5 kg CO₂e/year
- Replacement technology annual O&M: $30
- Replacement capital and installation: $1,000 total
- Entered decommissioning cost: $0; gas recovery cost: $0; technology residual value: $0. Enter zero to make these costs explicitly known; leaving them blank marks lifecycle costs incomplete.
- Expected scenario emissions: year 2026 = `24,305 kg CO₂e`; year 2027 = `5 kg CO₂e`; total = `24,310 kg CO₂e`
- Expected avoided emissions vs. baseline: `24,290 kg CO₂e`
- Expected scenario net present cost: `$1,060`; incremental NPC vs. baseline: `$760`

Check that the report labels units, horizon, factor source/version, currency and price year, and that results remain estimates within the documented operational-emissions boundary.

## Domain review questions

Record a response and evidence for each item:

1. Are the leakage inputs, end-of-life recovery treatment, replacement-year convention, and baseline appropriate for the intended utility planning process?
2. Are all lifecycle-cost categories, discounting, price-year handling, residual value, and budget checks understandable and adequate for exploratory planning?
3. Is GWP₁₀₀ = 24,300 applicable to the intended use and source jurisdiction? Is the cited IPCC source clear?
4. Are alternative technology emissions represented with enough evidence? Are unquantified lifecycle impacts and compatibility limits conspicuous?
5. Are ranking dimensions and weights useful for prioritization without implying engineering approval?
6. Are the report and export language clear about estimates, missing inputs, scope exclusions, and regulatory limitations?

## Utility workflow review session

Use this session with a utility asset planner, maintenance planner, or other representative user. It evaluates workflow fit and clarity; it is not technical approval of the calculation model. Use the illustrative sample workspace or invented values only. Do not enter confidential utility records.

### Session record

- Participant role and relevant workflow experience (no personal name required):
- Organization type / utility context (optional, non-identifying):
- Facilitator:
- Date:
- App version / URL / browser / device:
- Session length:
- Consent to record anonymized observations:
- Critical misunderstandings or blockers:
- Follow-up issue IDs:
- Overall result: usable for exploratory workflow / changes required / unable to complete:

As of 2026-11-03, Bored Polymath Studios has no representative utility planner session arranged; the workflow review remains open.

### Task script

Ask the participant to think aloud. Do not explain a label or calculation until after noting whether they can interpret it unaided.

1. Start a new workspace, create a project, set the horizon and currency, and add two sites. Ask which project assumptions they expected to set first.
2. Add one asset using an estimated annual loss and a second using measured annual loss. Identify the evidence source for each. Ask whether the distinction and units are clear.
3. Import an illustrative CSV, correct one invalid row, and export the inventory. Ask whether the required columns and error feedback match their workflow.
4. Add a replacement technology profile with a source and at least one unknown specification. Ask what evidence they would need before treating the profile as a candidate.
5. Create a continued-operation scenario and a phased replacement scenario. Assign one asset to a replacement year, record recovery efficiency and cost inputs, and leave one cost blank. Ask the participant to explain what is unknown and what is treated as zero.
6. Compare scenario cards, inspect Roadmap and Reports, and explain the ranking, emissions difference, lifecycle-cost outputs, and warning labels in their own words.
7. Export scenario results and identify the input sources, units, year convention, factor provenance, exclusions, and independent-review status.
8. Download and restore a backup in a separate test profile. Find the local-storage and shared-device/backup disclosure.

### Observation record

For each task, record completion (completed / completed with help / blocked), time if practical, labels misunderstood, values entered incorrectly, missing information, unexpected behavior, and the participant's own suggested wording. Separate observed behavior from facilitator interpretation. Record severity and whether the issue prevents safe exploratory use.

### Follow-up questions

- Which fields, defaults, or terms do not match your normal planning process?
- Which data are measured, estimated, or unavailable in your workflow, and does Gridshift distinguish them clearly?
- Can you explain what the ranking score does and does not mean?
- Do the scenario cards and report answer the comparison questions you need? What is missing?
- Which warnings would you need before sharing or acting on an exported result?
- What would make this workflow unsuitable even for early-stage exploration?

Do not mark a session passed solely because the participant completed the tasks. Resolve every critical misunderstanding or record it prominently as an unresolved use limitation.

## External reviewer request

Bored Polymath Studios is a lone-developer project and has no power-system engineering or climate/accounting experts attached. Independent external review has not been arranged and is not a public-launch gate under the owner's revised acceptance criteria. The app and exported scenario results must identify the model as not independently reviewed. Qualified review is still needed before results are used for operational, investment, or regulatory decisions. The request template below is retained for future review; a power-system reviewer should have practical experience reviewing utility switchgear/equipment planning or replacement assumptions, and a climate/accounting reviewer should have experience with GHG inventory or emissions accounting, GWP factors, leakage/recovery treatment, and lifecycle boundaries. Reviewers should state relevant experience and scope; this request is for technical review, not certification.

### Request template

**Subject:** Independent review request: Gridshift SF₆ transition planning model

Hello,

Bored Polymath Studios is preparing Gridshift, a public, browser-local planning tool for exploring transitions away from SF₆ electrical equipment. The owner permits public release with an explicit unreviewed status, and we are seeking independent technical review before results are used beyond exploratory planning.

Would you review the attached [calculation model](CALCULATION_MODEL.md) and [release review packet](RELEASE_REVIEW_PACKET.md)? The review should cover the areas matching your expertise, check the hand-calculation examples independently, identify unsupported assumptions or misleading language, and record a decision with qualifications, date, findings, and any conditions. The tool is intended for exploratory planning; the review is not a request to certify regulatory compliance, project data, equipment compatibility, or investment decisions.

We can provide the current code and a test workspace containing illustrative data only. Please do not use or request confidential utility records in public issues or sample files.

Thank you,

Bored Polymath Studios

### Reviewer decision record

- Reviewer and organization:
- Relevant experience / qualifications:
- Review scope:
- Conflicts or limitations declared:
- Hand-check independently reproduced:
- Findings and required changes:
- Decision: approved / approved with conditions / not approved
- Date:

## Browser and device session

Target operating systems supplied for testing are Android, iOS/iPadOS, macOS, Windows, Linux, and ChromeOS. The owner reports personally testing all listed flows on each OS, but device model, exact browser/version, test date, build/URL, detailed results, and known gaps were not recorded. On 2026-11-03, the owner asked to mark those details `not recorded` and keep the gate open. Use Chrome on Android, Safari on iOS/iPadOS, and the documented desktop browser targets where available. Record one row per device/browser session; mark unknown details as `not recorded` and do not infer a passing result from OS coverage alone.

| Reviewer | Test date | Device model / OS | Browser and version | App URL / build | Install / launch result | Offline / update result | Data exchange / recovery result | Accessibility tools / result | Known gaps, evidence, decision |
|---|---|---|---|---|---|---|---|---|---|
| Bored Polymath Studios (owner-reported self-test) | Not recorded | Model not recorded / Android | Not recorded | Not recorded | Owner reports tested | Owner reports tested | Owner reports tested | Owner reports tested; tools and findings not recorded | Owner reports all listed flows tested; outcomes and evidence not recorded |
| Bored Polymath Studios (owner-reported self-test) | Not recorded | Model not recorded / iOS/iPadOS | Not recorded | Not recorded | Owner reports tested | Owner reports tested | Owner reports tested | Owner reports tested; tools and findings not recorded | Owner reports all listed flows tested; outcomes and evidence not recorded |
| Bored Polymath Studios (owner-reported self-test) | Not recorded | Model not recorded / macOS | Not recorded | Not recorded | Owner reports tested | Owner reports tested | Owner reports tested | Owner reports tested; tools and findings not recorded | Owner reports all listed flows tested; outcomes and evidence not recorded |
| Bored Polymath Studios (owner-reported self-test) | Not recorded | Model not recorded / Windows | Not recorded | Not recorded | Owner reports tested | Owner reports tested | Owner reports tested | Owner reports tested; tools and findings not recorded | Owner reports all listed flows tested; outcomes and evidence not recorded |
| Bored Polymath Studios (owner-reported self-test) | Not recorded | Model not recorded / Linux | Not recorded | Not recorded | Owner reports tested | Owner reports tested | Owner reports tested | Owner reports tested; tools and findings not recorded | Owner reports all listed flows tested; outcomes and evidence not recorded |
| Bored Polymath Studios (owner-reported self-test) | Not recorded | Model not recorded / ChromeOS | Not recorded | Not recorded | Owner reports tested | Owner reports tested | Owner reports tested | Owner reports tested; tools and findings not recorded | Owner reports all listed flows tested; outcomes and evidence not recorded |
| Codex local automated smoke | 2026-11-03 | Model not recorded / macOS 27.2 arm64 | Chromium 148.0.7778.96 via Playwright 1.60.0 (headless) | Local worktree and built `_site` v0.2.2 at `/Gridshift/` | Fresh profile project creation and switching passed; all seven screens opened with expected empty states | Service worker controlled the page, v6 shell cached, offline edit persisted across reload; uncached fetch failed with expected network `TypeError`. Simulated v6→v7 update kept v6 active until acceptance, kept the update button visible after navigation, then reloaded v0.2.3 with project data preserved and the old owned cache removed | Inventory CSV import/export, scenario-results CSV with review-status row, JSON backup, and no-conflict restore passed; malformed JSON restore left storage unchanged; cancel, separate-copy, and confirmed replace paths passed; 1.53 MB CSV rejected atomically when it would exceed the 3 MB workspace limit | 390×844 DOM/screenshot checks and all seven screens at 320/360/390/768/1280 px with a 173-character project name and 120 imported assets: no document overflow. Visible buttons/form controls at 390 and 1280 px met a 24×24 px target threshold after fixing 22 px site-action buttons; reduced-motion emulation passed. Required validation, error retention, heading fallback, dialog close/cancel focus, and a focused Tab/Enter/Escape project-create/mobile-More smoke passed. A separate solid-background text scan across all seven screens in light and dark emulation found and fixed several low-contrast pairs, then reported zero remaining; it is not a full WCAG audit. Full keyboard-only and screen-reader audits remain open | 320 px and 768 px layouts visually inspected. Corrupt-data recovery/confirmed clear, denied storage, quota failure with current-tab state retained, and cross-tab edit/clear propagation passed. No page errors. Not a physical-device or production-host test; native install/update, eviction/private browsing, and assistive-technology checks remain open |
| Codex local v8 smoke | 2026-11-03 | Model not recorded / macOS 27.2 arm64 | Chromium 148.0.7778.96 via Playwright 1.60.0 (headless) | Built `_site` v0.2.3 served over loopback at `/Gridshift/` | Fresh profile loaded; illustrative sample workspace opened; Settings showed app version 0.2.3 | Worker controlled the page and installed `gridshift-shell-v8`; offline reload returned to Dashboard, and Settings remained reachable via the mobile More menu. A staged v7→v8 update left v7 active until the user accepted; after acceptance v8 activated, v7 cache was removed, and sample project data was unchanged | No import/export or restore flows in this session | At 390×844, Settings showed the shared-origin warning and had no horizontal overflow; no page errors. Not a full accessibility check | This tests the local Pages-path artifact, not GitHub Pages, a physical device, or native install |

After the recorded update simulation, the local release candidate advanced its service-worker cache from v6 to v7 for the final app-shell edits. The contrast recheck loaded the current files directly and did not exercise service-worker update behavior. At 390×844, the mobile text scan found and fixed low contrast on inventory Remove actions; its rerun found no below-threshold text pairs on the seven screens under light or dark emulation. This remains a solid-background probe, not a full WCAG audit.

Additional v7 PWA smoke on 2026-11-03: Chromium 148.0.7778.96 / Playwright 1.60.0 on macOS 27.2 arm64 loaded the built local shell under `http://127.0.0.1:8779/Gridshift/`. A fresh profile was controlled by the service worker, installed the v7 cache, saved a sample project, reloaded the dashboard offline, opened Settings offline, and retained the project. No page errors occurred. This loopback test is not GitHub Pages or physical-device evidence.

Additional v8 PWA smoke on 2026-11-03: Chromium 148.0.7778.96 / Playwright 1.60.0 on macOS 27.2 arm64 loaded the built `_site` under a local `/Gridshift/` path. A fresh profile installed `gridshift-shell-v8`, opened the illustrative workspace and Settings, displayed the 0.2.3 version and shared-origin warning, and had no horizontal overflow at 390×844. After going offline, reload returned to the Dashboard; the mobile More menu opened Settings offline. No page errors occurred. A separate staged-update run is recorded below. This does not test GitHub Pages, native installation, or physical devices.

Additional v7→v8 staged-update smoke on 2026-11-03: Chromium 148.0.7778.96 / Playwright 1.60.0 on macOS 27.2 arm64 started from a fresh profile with a v7 worker, then received the v8 worker from the local `/Gridshift/` fixture. The v7 cache remained active while the v8 update waited; the update action stayed visible after navigating to Settings. Accepting the action activated v8, removed the v7 cache, preserved the exact saved sample-project JSON, and reloaded with Gridshift 0.2.3 visible in Settings. No page errors occurred. This validates the local worker update flow only, not GitHub Pages or native device installation.

Additional empty-state and locale smoke on 2026-11-03: Chromium 148.0.7778.96 / Playwright 1.60.0 on macOS 27.2 arm64 created an empty project at 390×844 under a local `/Gridshift/` path, opened all seven screens (including Settings through More), and found no horizontal overflow. The sample scenario rendered USD for `en-US`, EUR for `fr-FR`, and JPY for `ja-JP`, with the expected grouping/symbols and no overflow or page errors. Other locales, unusual values, browser zoom, and browser/device differences remain untested.

Additional synthetic boundary-value layout smoke on 2026-11-03: Chromium 148.0.7778.96 / Playwright 1.60.0 on macOS 27.2 arm64 exercised supported-range extreme values on all seven screens at 320, 390, 640, 768, and 1280 px. The initial 320 px Reports view overflowed; stacking report metric cards, allowing large values to wrap, and adapting cumulative-chart axis width to label length resolved it. The rerun passed all 35 screen/viewport combinations without horizontal overflow or page errors. Inputs were synthetic layout stressors and do not establish realistic domain assumptions, zoom behavior, or browser/device coverage.

Run the scenarios in `RELEASE_RUNBOOK.md`, including first launch, an empty workspace, project and scenario creation, CSV import/export, JSON restore/cancel/conflict handling, offline launch and editing, update acceptance, storage recovery, keyboard navigation, screen-reader use, zoom, and narrow layouts.

## Release owner decision

- Product/release owner: Bored Polymath Studios
- Support route: GitHub issue templates and private vulnerability reporting; no separate support email supplied
- Internal expertise: Bored Polymath Studios is a lone-developer project; no power-system engineering or climate/accounting experts are attached.
- External qualified reviewers: none arranged. On 2026-11-03 the owner confirmed there are no relevant experts on the project and chose neither reviewer research nor owner-led sourcing. The owner subsequently revised the launch criteria to allow an explicitly unreviewed release. No domain approval is implied; qualified review remains necessary before operational, investment, or regulatory use.
- Intended public audience: public users; primary audience is electricity utility teams exploring early-stage transition planning, consistent with the README scope.
- Owner-approved release acceptance criteria (approved 2026-11-03; the added same-origin item below is pending approval):
  1. The app, README, model documentation, and scenario-results exports state that the model has not received independent qualified power-system engineering or climate/accounting review. Outputs remain described as exploratory estimates, with qualified review required before operational, investment, or regulatory decisions. Domain review is not a public-launch gate under this revised criterion.
  2. The 19 automated tests pass in repository CI, and the owner's six-platform test report includes device, browser/version, date, URL/build, results, and known gaps.
  3. The published GitHub Pages project path serves the manifest, worker, icons, and app shell correctly over HTTPS; install, offline launch, user-controlled update, backup restore, and recovery pass on the agreed platform matrix.
  4. The release owner accepts local-only storage limits, host visitor-IP logging, and GitHub Pages' lack of custom response headers.
  5. Bored Polymath Studios accepted retaining the planned shared GitHub Pages origin on 2026-11-03, understanding that any page on `boredpolymath.github.io` can read, change, or delete Gridshift localStorage when opened in the same browser profile. Keep the warning visible, and do not store confidential utility records on the shared origin unless every publisher on it is trusted. This is a separate accepted risk; it does not imply that the origin provides storage isolation.
  6. Public support/security routes and ongoing maintenance owners are recorded; rollback is available from a retained source revision.
- Accepted limitations: Bored Polymath Studios accepts GitHub Pages visitor-IP logging and its response-header limits for the planned release; live verification is pending.
- Privacy disclosure review: Bored Polymath Studios approved the shared-device, extension-permission, and readable/unencrypted JSON-backup wording in README, Settings, and SECURITY.md on 2026-11-03.
- Same-origin disclosure and risk decision: wording was added to README, Settings, and SECURITY.md on 2026-11-03 after the source-level security scan found the shared-host localStorage exposure. On 2026-11-03 Bored Polymath Studios chose to retain the planned GitHub Pages URL and explicitly accept this exposure for the release, subject to the visible warning and no confidential utility records unless every same-origin publisher is trusted.
- Acting maintenance owners: Bored Polymath Studios, currently the sole developer, owns support triage, security updates, browser support decisions, and calculation-source updates until reassigned. No backup maintainer or named individual is recorded.
- Final decision and date:
