# Contributing to Gridshift

Thanks for your interest in improving Gridshift. Bug reports, thoughtful feature ideas, documentation updates, and code contributions are welcome.

## Before opening an issue

- Search existing issues to see whether the problem or idea is already covered.
- For a bug, include the browser and version, steps to reproduce, what you expected, and what happened. Use sample data where possible; do not attach private utility or customer data.
- For an idea, explain the planning problem it addresses and how you expect a user to work through it.
- Report security vulnerabilities privately using the process in [SECURITY.md](SECURITY.md), not a public issue.

## Making a change

1. Fork the repository and create a branch for your change.
2. Keep changes focused and explain the user problem they solve.
3. Preserve Gridshift's local-first behavior: project records stay in browser storage and are not sent to a server.
4. Keep planning assumptions, data sources, and limitations visible. Avoid presenting estimates as engineering or regulatory advice.
5. Update the README or in-app guidance when behavior or user workflows change.
6. Open a pull request with a concise summary, the reason for the change, and steps reviewers can use to inspect it. Include screenshots for visible interface changes when practical.

## Running Gridshift locally

Gridshift is a static web app with no package installation or build step. From the repository root, run:

```sh
python3 -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000). A local server is needed to exercise service-worker installation and offline caching. You can open `index.html` directly for a quick visual check.

Before submitting, review your change in a current browser and check the relevant workflow. If you cannot check a particular browser or workflow, mention that in the pull request.

## Pull request expectations

- Describe what changed and why.
- Link related issues using GitHub keywords such as `Fixes #123` when applicable.
- Call out changes to calculations, data formats, browser storage, or assumptions.
- Do not include real project records, secrets, credentials, or personally identifiable information.
- Be open to review feedback; maintainers may ask for revisions or clarification before merging.

By participating, you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).
