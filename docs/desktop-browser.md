# Desktop Browser

Chrome Pro Desktop is an Electron application that embeds Chromium locally. It is not a server-side Chromium service.

## Development

```bash
cd desktop
npm install
npm start
```

## Important files

- `main.js` — Electron main process, windows, BrowserViews, sessions, navigation, history and bookmarks.
- `preload.js` — restricted IPC bridge.
- `browser-ui.html` — Chrome Pro browser chrome.
- `browser-ui.js` — browser UI behavior.
- `package.json` — Electron scripts and packaging configuration.

## Current capabilities

- Tabs
- Address/search navigation
- Back, forward and reload
- Incognito windows
- Named profiles
- Bookmarks
- Local history
- Clear browsing data
- Native minimize/maximize/close controls

## Packaging

```bash
npm run dist
```

Before publishing installers, verify the generated artifact on every supported operating system and test upgrade, uninstall, profile persistence, navigation, and crash recovery.

## UI layout contract

The browser chrome currently reserves a fixed top region. Keep the height used by `main.js` and `browser-ui.html` synchronized when changing the toolbar. A mismatch can create a visible gap between the Chrome Pro controls and webpage content.

## Production gaps

Extension support, robust download management, crash recovery, signed updates, deeper privacy controls, and OS-specific hardening remain part of the roadmap.
