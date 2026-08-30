# Chrome Pro

A modern browser/search workspace built with Next.js. The project is designed as the web control plane for a future Chromium-based desktop browser.

## Included now

- Chrome-style tabs and address bar
- Keyboard shortcuts: Ctrl/Cmd+L, Ctrl/Cmd+K, Ctrl/Cmd+T
- Web URL navigation and search routing
- Resilient search adapter for Nova Search/SearXNG
- Search results UI with external-result fallback
- AI mode UI ready for provider integration
- Production `/api/health` endpoint
- Security headers and Vercel configuration
- Responsive desktop/mobile UI

## Environment

Set `SEARCH_ENGINE_URL` to your SearXNG or Nova Search HTTP endpoint. Example:

`SEARCH_ENGINE_URL=https://your-search-service.example`

The search adapter calls `/search?q=...&format=json` and times out after seven seconds. If the provider is unavailable, the UI remains available and offers a web fallback.

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Production roadmap

1. Chromium desktop shell (Windows/macOS/Linux)
2. AI gateway with provider failover
3. Bookmarks/history/download manager
4. Privacy and permission controls
5. Redis/cache and rate limiting
6. Observability, synthetic uptime checks and automated rollback
7. Signed installers and auto-update channel

Chrome Pro is intentionally separated into a browser client and resilient backend services so a search or AI outage does not take down the browser experience.
