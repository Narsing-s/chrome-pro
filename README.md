# Chrome Pro

> A user-first, Chromium-powered browser project focused on a clean experience, resilient search, useful power features, and an open contribution loop.

[![CI](https://github.com/Narsing-s/chrome-pro/actions/workflows/ci.yml/badge.svg)](https://github.com/Narsing-s/chrome-pro/actions/workflows/ci.yml)

Chrome Pro has two parts:

- **Web control plane** — Next.js UI for the browser experience, search, health checks, and the public product surface.
- **Desktop browser** — Electron shell using the local Chromium runtime, with tab/window management, navigation, profiles, and browser controls.

The project is intentionally built as a **Chrome-like browser experience, not a claim of being Google's Chrome or a replacement for the Chromium project**. Planned capabilities are clearly separated from what is shipped today.

## Why Chrome Pro?

Chrome Pro is designed around a simple goal: make an advanced browser feel understandable to normal users while giving power users room to customize and extend it.

### Current capabilities

- Chrome-style tabs, toolbar, address/search bar, and navigation controls
- URL navigation and search routing
- Resilient Nova Search/SearXNG adapter with timeout and fallback behavior
- Responsive web UI
- AI-mode interface ready for provider integration
- Desktop Electron shell with Chromium BrowserViews
- Browser profiles and incognito-session foundations
- Bookmarks/history/download foundations in the desktop architecture
- `/api/health` production health endpoint
- Security headers and Vercel deployment configuration
- GitHub issue templates, PR guidance, contribution docs, and feedback workflow

### Product principles

1. **User first** — clear controls, useful defaults, accessible states.
2. **Fast by default** — avoid unnecessary work on startup and navigation paths.
3. **Resilient** — a failed search/AI/network dependency should not make the browser unusable.
4. **Private by design** — keep secrets out of source control and minimize privileged renderer access.
5. **Open to contributors** — reproducible issues, UX feedback, documentation, tests, and features are welcome.

## Repository layout

```text
chrome-pro/
├── app/                 # Next.js web application
│   ├── api/health/      # Service health endpoint
│   ├── download/        # Download/product page
│   └── search/          # Search experience
├── desktop/             # Electron desktop browser
│   ├── main.js          # Main process and browser windows/tabs
│   ├── preload.js       # Narrow IPC bridge
│   ├── browser-ui.html  # Desktop browser chrome
│   └── browser-ui.js    # Desktop browser interactions
├── docs/                # Product, architecture, setup, roadmap and contributor docs
├── public/              # Web manifest and public assets
└── .github/             # CI, release automation, issue/PR templates
```

## Quick start

### Web

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

For a production-style local run:

```bash
npm run build
npm start
```

### Desktop

```bash
cd desktop
npm install
npm start
```

Set `CHROME_PRO_START_URL` when the desktop shell should open a deployed or alternate local web UI.

## Search configuration

Set `SEARCH_ENGINE_URL` to a compatible Nova Search or SearXNG HTTP endpoint:

```text
SEARCH_ENGINE_URL=https://your-search-service.example
```

The adapter requests `/search?q=...&format=json`, applies a seven-second timeout, and keeps the UI usable when the provider is unavailable. Never commit API keys, passwords, database URLs containing credentials, cookies, or private tokens.

## Documentation

Start with [`docs/README.md`](docs/README.md). It links to:

- getting started and environment setup
- architecture and security boundaries
- desktop browser development
- web/search behavior
- troubleshooting
- contribution and feedback standards
- product direction and roadmap
- Redmine/project-management guidance

## Community and feedback

Chrome Pro is intentionally open to users and contributors. Please use GitHub Issues for bugs, feature requests, performance reports, and product feedback. UI reports are especially valuable when they include screenshots, reproduction steps, operating system, commit/version, and console or application logs.

Please do **not** post credentials, access tokens, cookies, private URLs, or sensitive browsing data.

## Reliability expectations

The project is designed for dependable long-running use, but no software can honestly promise zero downtime or zero defects. Reliability work therefore focuses on graceful degradation, explicit health checks, automated CI, observable failures, timeouts, and safe release practices.

## Roadmap highlights

- richer tab/session restoration
- bookmarks, history, downloads, and permission controls
- stronger privacy controls
- AI gateway with provider failover
- caching/rate limiting and observability
- signed desktop installers and auto-update channels
- accessibility and internationalization improvements

See [`docs/roadmap.md`](docs/roadmap.md) for the maintained roadmap.

## License

The repository currently does not declare a project license. Until a license is added, contributors should treat the source as **all rights reserved** and should not assume permission to redistribute or reuse it.

## Project identity

**Chrome Pro** is the project name used in this repository. It is an independent project and is not affiliated with or endorsed by Google.
