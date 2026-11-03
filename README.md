# Gridshift

![Gridshift planning a transition from legacy switchgear to lower-impact equipment](assets/gridshift-readme-hero.png)

<p align="center">
  <img src="assets/gridshift-icon-preview.png" alt="Gridshift circuit G icon" width="96" height="96">
</p>

### Plan a practical path away from SF₆.

Gridshift is a local-first planning workspace for electricity teams exploring the transition from SF₆ equipment to lower-impact alternatives. It brings asset records, technology information, replacement plans, and planning estimates together so teams can compare options and see what needs further review.

**Build an inventory. Compare alternatives. Shape a transition plan.**

> **Independent review status: not independently reviewed.** No independent qualified power-system engineering or climate/accounting review has been completed. Gridshift is for exploratory estimates only. Verify assumptions and obtain qualified review before operational, investment, or regulatory decisions.

## What you can do

- **Understand the portfolio.** Organize equipment by site and capture ratings, installation and retirement dates, condition, and annual SF₆ loss.
- **Keep evidence close to decisions.** Record technology profiles, electrical characteristics, gas composition, and source references. Missing information remains visible.
- **Explore phased scenarios.** Assign candidate technologies and replacement years, set annual budgets, and compare plans against continued operation.
- **See priorities and timing.** Review candidate rankings, planned replacements, annual capital needs, estimated emissions, and lifecycle costs.
- **Keep a reviewable record.** Inspect assumptions and calculation notes, export inventory and scenario CSVs, and save or restore a complete JSON backup.
- **Work locally.** Project data stays in this browser. No account or cloud sync is required.

The default SF₆ GWP₁₀₀ assumption is **24,300**, from IPCC AR6 WGI Supplementary Material Table 7.SM.7 ([official source](https://www.ipcc.ch/report/ar6/wg1/downloads/report/IPCC_AR6_WGI_Chapter07_SM.pdf)). New projects use this value. When an older project still has Gridshift’s prior 25,200 default and its matching source label, Gridshift updates the project assumption and marks saved scenario snapshots for review. The old scenario value is retained so its historical calculation remains reproducible; edit and save that scenario to recalculate it.

## A straightforward planning flow

1. Create a project and set its planning horizon, currency, and emissions factor assumptions.
2. Add sites and equipment, or import an inventory CSV.
3. Record candidate technology profiles and their supporting references.
4. Create a scenario, assign technologies and replacement years, and set an annual budget.
5. Review candidate priorities, replacement timing, and annual budgets in Roadmap.
6. Open Reports to compare emissions and lifecycle costs, review assumptions, and export the planning record.

The navigation follows this sequence, with contextual “Continue to…” actions connecting the screens. Reports links back to Scenarios for further iteration. Sites and shared calculation assumptions are managed in Settings & data.

The sample workspace can help you explore the interface. Replace its illustrative inputs with verified project data before using the results.

## Interface and reporting

- **Cumulative emissions trajectory.** A dedicated, full-width report panel appears before the detailed comparisons. It includes baseline and scenario totals, avoided emissions or increases, distinct series colors, and a scale in tonnes of CO₂ equivalent.
- **Annual emissions views.** The same **Avoided emissions / Annual values** switch is available on mobile and desktop. The chart is the default: positive values mean emissions avoided, negative values mean an increase, and values are shown in t CO₂e. The alternative table provides annual baseline, scenario, and difference values in kg CO₂e.
- **Responsive inventory and ranking.** At viewport widths of 760px or less, compact cards replace the wide inventory and candidate-ranking tables. Inventory cards expose key equipment values and Edit/Remove actions; ranking cards show score, retirement year, emissions, condition, and screening status. Desktop retains the detailed tables. Longer collections still require vertical scrolling.
- **Readable mobile navigation.** Short labels—Home, Assets, Tech, Plan, Roadmap, and Reports—keep navigation compact, with full accessible names for assistive technology. Mobile card labels and values have been enlarged.
- **Action hierarchy.** Primary actions use a light accent, secondary actions use neutral styling, and destructive actions have a distinct treatment. Keyboard focus indicators remain available.
- **Focused branding.** The selected circuit G appears as the browser/app icon and as a larger, transparent sidebar mark. The sidebar wordmark and decorative local-workspace avatar have been removed.

The app icon is maintained in `icon.svg`; `assets/gridshift-mark.svg` is the transparent sidebar version, and `assets/gridshift-icon-preview.png` provides a raster preview. The service-worker shell cache includes the sidebar asset and has been versioned for these updates.

## Try Gridshift

Gridshift is a static web app with no build step or runtime dependencies. For a full local experience, including offline caching, serve the project directory over localhost:

```sh
python3 -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000). You can also open `index.html` directly for a quick preview; service-worker installation and offline caching require localhost or HTTPS.

### Release support target

The release target is current and previous major versions of desktop Chrome, Edge, Firefox, and Safari, plus current iOS/iPadOS Safari and Android Chrome. Install and offline behavior must be checked on each supported platform before a production release. The planned public host is GitHub Pages at `https://boredpolymath.github.io/Gridshift/`; local development uses localhost. The app uses relative URLs for the project-site path, which still needs live browser verification.

The repository includes a GitHub Actions Pages workflow. Repository Settings → Pages must select GitHub Actions as the publishing source before deployment. GitHub Pages does not expose arbitrary response-header configuration; see [RELEASE_RUNBOOK.md](RELEASE_RUNBOOK.md) for the accepted header limitation and launch checks.

The service worker caches the current app shell for offline use and checks for a newer version. When an update is ready, choose **Update ready · Reload** to activate it. The app does not synchronize local project data between browsers or devices.

## Designed for transparent planning

Gridshift keeps measured annual losses separate from estimated loss rates, shows incomplete inputs, and preserves key assumptions with saved scenarios. See [CALCULATION_MODEL.md](CALCULATION_MODEL.md) for the current equations, boundaries, and open review decisions. Its estimates can support early planning and comparison; they do not replace engineering studies, manufacturer documentation, regulatory review, or approval by qualified professionals. Manufacturing and construction emissions are not included in the current model.

## Your data, in your browser

Gridshift stores modest project workspaces in browser-local storage, with a 3 MB serialized-data ceiling to leave room under typical browser quotas. Larger portfolios should be split into smaller workspaces; IndexedDB or a managed data service would be needed for a higher-volume release. It does not sync project data to a server. Browser storage can be cleared or evicted, so export a JSON backup and store it securely. Local storage is not an enterprise access-control or encryption system; use care on shared devices and browser profiles. Browser extensions granted access to this site may read or change site data or page content ([Chrome host permissions](https://developer.chrome.com/docs/extensions/develop/concepts/declare-permissions), [MDN content scripts](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Content_scripts)). Use only trusted extensions in a profile that holds planning records. Downloaded JSON backups contain readable project data, are not encrypted by Gridshift, and must be protected or deleted separately.

The planned GitHub Pages URL is under `boredpolymath.github.io`. Other pages on that exact host share the browser storage origin even when their URL paths differ. Code on another page served from that host can read, change, or delete Gridshift data if you visit it in the same browser profile. This does not apply to unrelated website origins. Do not store confidential utility records on the planned host unless every publisher and page on that origin is trusted; a dedicated Gridshift hostname is required to isolate the browser storage.

The app code does not send project data to an application server or analytics service. GitHub says it logs and stores visitors' IP addresses for security when a GitHub Pages site is visited ([Pages data collection](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages#data-collection)); its documentation does not state a Pages-specific retention period. Review [GitHub's Privacy Statement](https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement) before using the public site. The app provides local export and deletion controls; deleting browser data does not remove downloaded backup files.

## Project policies

Gridshift is maintained by **Bored Polymath Studios**. For bugs and product feedback, use the repository's [issue templates](https://github.com/boredpolymath/Gridshift/issues/new/choose); do not include private utility records. No separate support email was provided for this release. For vulnerability reports, follow [SECURITY.md](SECURITY.md). Gridshift is released under the [MIT License](LICENSE).

---

**Gridshift is an explicitly unreviewed planning tool.** Results depend on the assumptions and source data entered by the user. No independent qualified power-system engineering or climate/accounting review has been completed; do not use these estimates alone for operational, investment, or regulatory decisions.
