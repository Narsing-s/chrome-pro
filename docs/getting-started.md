# Getting Started

## Prerequisites

- Node.js 22+ for the web application.
- npm.
- Windows, macOS, or Linux for web development.
- Electron desktop development is currently centered on the `desktop/` application.

## Web application

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

For production builds:

```bash
npm run build
npm start
```

## Search provider

Set `SEARCH_ENGINE_URL` to a compatible Nova Search or SearXNG HTTP endpoint. The application requests JSON search results and keeps the interface usable when the provider is unavailable.

Example:

```text
SEARCH_ENGINE_URL=https://your-search-service.example
```

Never commit API keys, passwords, database URLs containing credentials, or private tokens.

## Desktop application

```bash
cd desktop
npm install
npm start
```

The desktop shell uses Electron's local Chromium runtime. `CHROME_PRO_START_URL` can point the shell at a deployed or local Chrome Pro UI.

## First contribution

1. Fork the repository.
2. Create a focused branch.
3. Make one logical change.
4. Run the relevant tests/build checks.
5. Open a pull request with screenshots for UI changes.

See [Contributing](contributing.md) before opening a large change.
