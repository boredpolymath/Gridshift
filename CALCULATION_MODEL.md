# Gridshift calculation contract

This document describes the deterministic model in `core.js` (calculation version 1.2). **No independent qualified power-system engineering or climate/accounting review has been completed.** The model is an exploratory planning aid, not approved for utility investment, engineering, or regulatory use.

## Emissions

- Asset annual SF₆ loss is either the entered measured mass (`kg/year`) or nameplate capacity (`kg`) multiplied by the entered annual loss fraction.
- The baseline applies that annual loss in every year of the planning horizon. It assumes the entered annual rate remains constant; it does not age, decay, or otherwise forecast the loss rate.
- Annual CO₂-equivalent emissions are `annual SF₆ loss (kg) × SF₆ GWP₁₀₀` and are reported internally in `kg CO₂e`.
- The default for new projects is 24,300 over 100 years, from IPCC AR6 WGI Supplementary Material Table 7.SM.7 ([official table](https://www.ipcc.ch/report/ar6/wg1/downloads/report/IPCC_AR6_WGI_Chapter07_SM.pdf)). The exact value and source can be changed in project assumptions.
- A replacement is modeled at the start of its assigned year: normal annual SF₆ leakage is omitted in that year, and end-of-life emissions are `remaining SF₆ mass × (1 − recovery efficiency) × GWP`.
- From the replacement year onward, annual alternative equipment emissions are added when a profile value is supplied. Unknown alternative emissions are flagged as incomplete.
- The model does not currently include manufacturing, construction, upstream gas production, grid dispatch effects, or other lifecycle emissions unless a user-entered alternative annual emissions value represents them. Profile fields do not guarantee that it does.

## Costs

- Baseline annual cost is the sum of entered asset operating and maintenance costs.
- In a replacement year, scenario cost adds replacement capital, installation, decommissioning, gas recovery, and the selected technology's annual operating and maintenance costs. Later years use the profile's annual operating and maintenance costs.
- A technology residual value is credited in the final modeled year for a replacement scheduled within the planning horizon.
- Net present cost discounts each year's modeled cost from the base year: `Σ cost(year) / (1 + discount rate)^(year − base year)`. The first modeled year has exponent zero.
- Incremental net present cost is scenario NPC minus continued-operation NPC. The annual budget check compares only replacement capital expenditure with the scenario budget; it does not limit operating cost.
- Blank cost fields remain unknown for new and imported records and cause the result to be flagged partial. This includes replacement technology residual value whenever the technology is scheduled within the modeled horizon. Enter zero when there is no residual value. An entered zero is treated as a deliberate zero. Older versions stored blank costs as zero; Gridshift migrates those project fields to unknown and marks affected saved snapshots for review without changing their stored calculation inputs.

## Scenarios and incomplete data

- A saved scenario stores asset and technology inputs, emissions assumptions, currency, price year, discount rate, planning years, calculation version, and replacement assignments.
- Existing scenarios keep their saved values when shared project assumptions change. The previous Gridshift 25,200 default is migrated to 24,300 at the project level, while saved scenarios with that value keep their number and receive a review warning.
- Missing annual loss, end-of-life recovery, alternative emissions, or cost data is reported as incomplete. Cost per tonne avoided is unavailable when the calculation is incomplete or avoided emissions are not positive. Other partial totals remain visible and must be read with their warnings.
- Technology comparisons and candidate rankings are preliminary data screens; they do not determine equipment compatibility or engineering approval.

## Open review decisions

Before results from this model inform operational, investment, or regulatory decisions, qualified power-system and climate/accounting reviewers must confirm the time convention, emissions boundary, treatment of end-of-life gas and alternative gases, cost categories, residual value, annual budget definition, discounting convention, and the applicability of the selected GWP metric. Jurisdictional reporting requirements and project-specific manufacturer evidence also require review.

The repository's unit tests check arithmetic and selected boundary cases. `scripts/verify_hand_checks.py` separately reproduces the release packet's example arithmetic using Decimal operations. These checks do not replace an independent domain review or validate real asset data.

The current product stores a single-browser workspace in local storage and limits serialized app data to approximately 3 MB. This is a conscious first-release constraint for modest planning workspaces; larger portfolios require IndexedDB or a separately reviewed shared-data architecture.
