# Gridshift

![Gridshift planning a transition from legacy switchgear to lower-impact equipment](assets/gridshift-readme-hero.png)

<p align="center">
  <img src="assets/gridshift-icon-preview.png" alt="Gridshift circuit G icon" width="96" height="96">
</p>

## A clearer path beyond SF₆

Gridshift is now public: a focused planning workspace for electricity teams exploring a transition from SF₆ equipment to lower-impact alternatives. Bring your equipment records, candidate technologies, budgets, and timing into one place—then turn an uncertain portfolio into a practical, explainable roadmap.

**[Launch Gridshift](https://boredpolymath.github.io/Gridshift/)** · **[Share feedback](https://github.com/boredpolymath/Gridshift/issues/new/choose)**

No account. No cloud workspace. Your planning data stays in the browser you use.

## Turn equipment data into a transition plan

Gridshift is built for the early questions that precede a major fleet decision:

- **What do we have?** Build a clear inventory by site, rating, condition, installation date, retirement date, and annual SF₆ loss.
- **What could replace it?** Keep candidate technology details, gas composition, electrical characteristics, sources, and information gaps alongside the decision.
- **What should happen first?** Rank opportunities, assign replacement years, and shape a phased scenario around the budget available each year.
- **What does the path look like?** Compare continued operation with a scenario across emissions, lifecycle costs, annual capital needs, and replacement timing.

The result is a planning record you can revisit, refine, and bring into the next conversation.

## From scattered facts to a shared view

### Know the portfolio

Capture the equipment details that matter without forcing every record to be complete on day one. Gridshift makes missing inputs visible, so uncertainty is part of the conversation rather than hidden inside a spreadsheet.

### Explore credible options

Record alternative technologies and the evidence behind them. Create as many scenarios as you need, test different replacement years and annual budgets, and see the trade-offs before committing to a direction.

### Make the roadmap legible

See candidate priorities, scheduled replacements, annual spend, cumulative emissions, and lifecycle-cost estimates in one connected flow. Export inventory and scenario data when it is time to share the work beyond Gridshift.

## Planning that stays in your hands

Gridshift is local-first by design. It works in the browser, can be used offline after it is opened, and does not require an account or application-server sync. Export a CSV for inventory or scenario results, or save a full JSON backup whenever you want a portable record.

The starting emissions factor for new projects is an SF₆ GWP₁₀₀ of **24,300**, based on IPCC AR6 WGI Supplementary Material Table 7.SM.7 ([source](https://www.ipcc.ch/report/ar6/wg1/downloads/report/IPCC_AR6_WGI_Chapter07_SM.pdf)). Assumptions remain visible with each scenario so teams can review and update them as their evidence improves.

## Start with the next useful step

1. **Open Gridshift** and create a planning workspace.
2. **Add sites and equipment**—or bring in an inventory CSV.
3. **Add technologies and sources** you want to assess.
4. **Build a scenario** around your likely timing and budget.
5. **Use Roadmap and Reports** to focus the next engineering, investment, or stakeholder discussion.

The included sample workspace is a quick way to see the workflow. Replace its illustrative values with your own verified planning data before relying on the results.

## Important context

> **Independent review status: not independently reviewed.** Gridshift is an exploratory planning tool, not an engineering study, a certified emissions calculation, or investment or regulatory advice. No independent qualified power-system engineering or climate/accounting review has been completed. Verify assumptions and obtain qualified review before operational, investment, or regulatory decisions.

Gridshift helps teams organize early-stage choices; it does not establish equipment compatibility, regulatory compliance, or a project’s final emissions or cost outcome. Manufacturing and construction emissions are not included in the current model. Read the [calculation model](CALCULATION_MODEL.md) for its boundaries, equations, and open review decisions.

## Your data and privacy

Your Gridshift workspace is stored locally in your browser. The app does not send project data to an application server or analytics service. Browser storage can be cleared or evicted, so regularly export a JSON backup and keep it somewhere appropriate for your organization.

Browser extensions granted access to this site may read or change site data or page content. Downloaded JSON backups contain readable project data, are not encrypted by Gridshift, and should be protected or deleted separately. Avoid entering confidential records on shared devices or browser profiles.

Gridshift is live at `boredpolymath.github.io/Gridshift/`. Other pages on that exact host share the browser storage origin even when their URL paths differ. Do not store confidential utility records on the planned host unless every publisher and page on that origin is trusted. A dedicated Gridshift hostname is needed to isolate this browser storage. GitHub logs visitor IP addresses for security when a GitHub Pages site is visited; see GitHub’s [Pages data-collection notice](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages#data-collection) and [Privacy Statement](https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement).

## Built in public

Gridshift is maintained by **Bored Polymath Studios** and released under the [MIT License](LICENSE). Have a product idea or found a reproducible issue? Use the repository’s [issue templates](https://github.com/boredpolymath/Gridshift/issues/new/choose)—please do not include private utility records. For security reports, follow [SECURITY.md](SECURITY.md).

For the project’s contribution guidance and technical documentation, see [CONTRIBUTING.md](CONTRIBUTING.md), [CALCULATION_MODEL.md](CALCULATION_MODEL.md), and [RELEASE_RUNBOOK.md](RELEASE_RUNBOOK.md).
