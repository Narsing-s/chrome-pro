# Contributing to Chrome Pro

Chrome Pro is built to be shaped by its users and contributors. Small fixes, reproducible bug reports, UX observations, performance measurements, documentation improvements, and ambitious features are all welcome.

## Before coding

Search existing issues and pull requests first. For a new feature, explain the user problem and proposed behavior before investing in a large implementation.

## Development principles

- Prefer small, reviewable changes.
- Keep browser UI responsive.
- Do not introduce secrets into source control.
- Preserve Electron isolation boundaries.
- Handle network failure explicitly.
- Update documentation when behavior changes.
- Include screenshots or recordings for meaningful UI changes.

## Pull requests

A good PR should explain:

1. What changed.
2. Why it changed.
3. How it was tested.
4. Any known limitations.
5. Whether documentation or configuration changed.

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
- Add keyboard shortcuts.
- Improve empty/error states.
- Reproduce and fix UI issues.
- Improve documentation.
- Add tests around browser state.
- Improve startup and navigation reliability.

## Feedback culture

Be specific, respectful, and reproducible. A report that includes the operating system, Chrome Pro version/commit, steps, expected behavior, actual behavior, and logs is especially useful.
