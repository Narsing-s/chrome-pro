# Getting Started

This guide gets both Chrome Pro surfaces running locally.

## Prerequisites

- Node.js 22 or newer for the web application.
- npm.
- Windows, macOS, or Linux for web development.
- A desktop development environment supported by Electron for the `desktop/` app.

## 1. Start the web application

From the repository root:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

For a production-style local check:

```bash
npm run build
npm start
```

## 2. Configure search

Create the environment configuration used by your deployment/local shell and set:

```text
SEARCH_ENGINE_URL=https://your-search-service.example
```

The application expects a search service that accepts `/search?q=...&format=json`. The integration has a seven-second timeout and should fail gracefully when the service is unavailable.

Do not commit API keys, passwords, database credentials, cookies, private URLs, or access tokens.

## 3. Start the desktop browser

In a second terminal:

```bash
cd desktop
npm install
npm start
```

To point the desktop shell at a different web UI:

```text
CHROME_PRO_START_URL=http://localhost:3000
```

The desktop application uses Electron's bundled Chromium runtime. The renderer does not need direct Node.js access; privileged operations belong in the main process/preload boundary.

## 4. Validate before opening a PR

Run the checks relevant to your change. At minimum, for web changes:

```bash
npm run build
```

For desktop changes:

```bash
cd desktop
npm start
```

Then manually verify navigation, tabs, address/search behavior, and the changed feature.

## 5. Make a contribution

1. Fork the repository.
2. Create a focused branch.
3. Explain the user problem you are solving.
4. Make one logical change at a time.
5. Run the relevant checks.
6. Add/update documentation.
7. Include screenshots or recordings for meaningful UI changes.
8. Open a pull request using the project template.

See [Contributing](contributing.md) and [Feedback](feedback.md).

## Common paths

- Web UI: `app/`
- Desktop shell: `desktop/`
- Documentation: `docs/`
- CI/release automation: `.github/workflows/`

## Troubleshooting

If something fails, check [Troubleshooting](troubleshooting.md) first. When reporting a new problem, include the exact command, operating system, commit/version, expected behavior, actual behavior, and relevant logs—without secrets or private browsing data.
