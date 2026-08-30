# Chrome Pro Desktop

Chrome Pro Desktop is the native Chromium-powered shell for the Chrome Pro web control plane.

## Development

```bash
cd desktop
npm install
npm start
```

Set `CHROME_PRO_START_URL` to point the desktop shell at your deployed Chrome Pro UI.

## Build installers

```bash
npm run dist
```

Electron packages the Chromium runtime with the application. The Next.js service remains the control plane/search UI; it is not expected to run Chromium on a server.

## Architecture

- `main.js`: native desktop process and hardened BrowserWindow configuration.
- Next.js app: browser workspace and search UI.
- Nova Search/SearXNG: search backend.
- Electron: local Chromium rendering/runtime.

For true production-grade browser functionality, add native session/profile management, downloads, bookmarks/history, extension support, crash recovery, signed auto-updates, and OS-specific sandboxing before public release.
