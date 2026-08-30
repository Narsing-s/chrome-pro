# Contributing to Chrome Pro

Thank you for helping build Chrome Pro.

## What we welcome

- Browser bugs and reproducible regressions
- UI/UX improvements
- Accessibility improvements
- Performance work
- Electron/Chromium improvements
- Search reliability improvements
- Tests and tooling
- Documentation
- Privacy and security improvements
- Features backed by a clear user problem

## Before you start

1. Search existing Issues and Discussions.
2. For a bug, reproduce it on the latest `main` when possible.
3. For a feature, open a discussion first if the scope is uncertain.
4. Never include passwords, API keys, cookies, access tokens, private URLs, or private browsing data in an issue or pull request.

## Development

### Web

```bash
npm install
npm run dev
```

### Desktop

```bash
cd desktop
npm install
npm start
```

## Pull requests

Keep pull requests focused. Explain:

- What changed
- Why it changed
- How you tested it
- Any limitations or follow-up work

For UI changes, include before/after screenshots when useful.

For navigation, networking, Electron, or security changes, include relevant logs and exact reproduction steps without sensitive data.

## Good first contributions

Look for issues labelled `good first issue`, `help wanted`, or `documentation`. Small, well-tested improvements are valuable.

## Commit guidance

Use concise messages such as:

- `fix: handle failed tab navigation`
- `feat: add session restore`
- `docs: improve desktop setup`
- `test: cover navigation history`

## Code quality

- Prefer small, readable changes.
- Avoid unnecessary dependencies.
- Keep renderer privileges narrow.
- Do not hard-code secrets.
- Preserve existing behavior unless the change intentionally modifies it.
- Test affected paths before opening a PR.

## Community

Be respectful and constructive. See `CODE_OF_CONDUCT.md` and `SECURITY.md` for community and security reporting guidance.
