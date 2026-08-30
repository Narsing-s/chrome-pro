# Troubleshooting

## Electron reports a JavaScript syntax error

Pull the latest `main`, reinstall dependencies if needed, and run:

```bash
cd desktop
npm install
npm start
```

If Node reports a specific line, inspect that line and the immediately preceding function call for unmatched parentheses, braces, or brackets.

## Browser chrome has a visible gap

The desktop main process reserves a fixed toolbar height. `UI_HEIGHT` in `desktop/main.js` must match the actual browser chrome height in `browser-ui.html`.

After changing the toolbar, restart Electron so the BrowserView bounds are recalculated.

## Search is unavailable

Verify `SEARCH_ENGINE_URL`, confirm the search service is reachable independently, and test its JSON search endpoint. A provider outage should leave the rest of Chrome Pro usable.

## Desktop dependencies are stale

```bash
cd desktop
npm install
npm start
```

Avoid deleting lockfiles as a first troubleshooting step. Preserve the repository's dependency resolution unless there is a specific reason to regenerate it.

## Security

Never paste API keys, cookies, passwords, access tokens, or private browsing data into issues or logs shared publicly.
