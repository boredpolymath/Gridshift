# Gridshift

![Gridshift planning a transition from legacy switchgear to lower-impact equipment](assets/gridshift-readme-hero.png)

<p align="center">
  <img src="assets/gridshift-icon-preview.png" alt="Gridshift circuit G icon" width="96" height="96">
</p>

### Plan a practical path away from SF₆.

Gridshift is a local-first planning workspace for electricity teams exploring the transition from SF₆ equipment to lower-impact alternatives. It brings asset records, technology information, replacement plans, and planning estimates together so teams can compare options and see what needs further review.

**Build an inventory. Compare alternatives. Shape a transition plan.**

## What you can do

- **Understand the portfolio.** Organize equipment by site and capture ratings, installation and retirement dates, condition, and annual SF₆ loss.
- **Keep evidence close to decisions.** Record technology profiles, electrical characteristics, gas composition, and source references. Missing information remains visible.
- **Explore phased scenarios.** Assign candidate technologies and replacement years, set annual budgets, and compare plans against continued operation.
- **See priorities and timing.** Review candidate rankings, planned replacements, annual capital needs, estimated emissions, and lifecycle costs.
- **Keep a reviewable record.** Inspect assumptions and calculation notes, export inventory and scenario CSVs, and save or restore a complete JSON backup.
- **Work locally.** Project data stays in this browser. No account or cloud sync is required.

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

Gridshift is a static web app. For a full local experience, including offline caching, serve the project directory over localhost:

```sh
python3 -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000). You can also open `index.html` directly for a quick preview; service-worker installation and offline caching require localhost or HTTPS.

## Designed for transparent planning

Gridshift keeps measured annual losses separate from estimated loss rates, shows incomplete inputs, and preserves key assumptions with saved scenarios. Its estimates can support early planning and comparison; they do not replace engineering studies, manufacturer documentation, regulatory review, or approval by qualified professionals. Manufacturing and construction emissions are not included in the current model.

## Your data, in your browser

Gridshift stores project data in browser-local storage. It does not sync project data to a server. Browser storage can be cleared or evicted, so export a JSON backup and store it securely. Local storage is not an enterprise access-control or encryption system; use care on shared devices.

## Project policies

Contributions are welcome; see [CONTRIBUTING.md](CONTRIBUTING.md) and the [Code of Conduct](CODE_OF_CONDUCT.md). For vulnerability reports, follow [SECURITY.md](SECURITY.md). Gridshift is released under the [MIT License](LICENSE).

---

**Gridshift is a planning prototype.** Results depend on the assumptions and source data entered by the user and should be independently reviewed before they inform investment or operational decisions.
