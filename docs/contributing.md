# Contributing to Chrome Pro

Chrome Pro is built to be shaped by its users and contributors. Bug fixes, reproducible reports, UX observations, accessibility improvements, performance measurements, documentation, tests, and focused features are all welcome.

## Before coding

Search existing issues and pull requests first. For a feature, describe the user problem and desired behavior before starting a large implementation.

## Development principles

- Prefer small, reviewable changes.
- Keep browser UI responsive.
- Preserve Electron isolation boundaries.
- Validate privileged IPC inputs.
- Handle network failure explicitly.
- Never commit secrets or private browsing data.
- Update documentation when behavior changes.
- Include screenshots/recordings for meaningful UI changes.
- Do not present planned functionality as already shipped.

## Pull requests

A good PR should explain:

1. What changed.
2. Why it changed.
3. How it was tested.
4. Known limitations or follow-up work.
5. Documentation/configuration impact.

Use the PR template and keep unrelated refactors out of focused fixes.

## Commit style

Use concise, descriptive commits such as:

```text
feat: add tab restore
fix: remove toolbar content gap
perf: reduce search request latency
docs: clarify desktop setup
```

## Good first contributions

- Improve accessibility.
- Add or refine keyboard shortcuts.
- Improve empty/error states.
- Reproduce and fix UI issues.
- Improve documentation.
- Add focused tests around browser state.
- Improve startup and navigation reliability.
- Improve search fallback behavior.

## Review expectations

Changes should be understandable, testable, and consistent with the product principles in [Product](product.md). Security-sensitive changes should be conservative and explicit about trust boundaries.

## Feedback culture

Be specific, respectful, and reproducible. A strong report includes the operating system, Chrome Pro version/commit, steps, expected behavior, actual behavior, and relevant logs. Never include passwords, API keys, cookies, access tokens, private URLs, or confidential browsing information.
