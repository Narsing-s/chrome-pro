# Troubleshooting

## Electron reports a JavaScript syntax error

Pull the latest `main`, then reinstall desktop dependencies and start again:

```bash
git pull origin main
cd desktop
npm install
npm start
```

If Node reports a line number, inspect that line and the immediately preceding expression for unmatched `()`, `{}`, or `[]`. Also check for an accidental merge conflict marker (`<<<<<<<`, `=======`, `>>>>>>>`).

## Browser chrome has a visible gap

The desktop main process reserves a fixed toolbar height. `UI_HEIGHT` in `desktop/main.js` must match the actual browser chrome height in `browser-ui.html`.

After changing toolbar dimensions, restart Electron so BrowserView bounds are recalculated.

## Search is unavailable

Verify `SEARCH_ENGINE_URL`, then test the provider independently:

```text
GET /search?q=test&format=json
```

A provider outage should leave the rest of Chrome Pro usable. Check the browser console/network output for timeout or HTTP-error details.

## Desktop dependencies are stale

```bash
cd desktop
npm install
npm start
```

Avoid deleting lockfiles as a first troubleshooting step. Preserve dependency resolution unless there is a specific reason to regenerate it.

## Web build fails

From the repository root:

```bash
npm install
npm run build
```

Check the first error in the build output rather than fixing only the final cascading error. For TypeScript/Next.js changes, verify imports, client/server boundaries, and environment variables.

## Health endpoint

The web application exposes `/api/health`. If it reports an unhealthy deployment, inspect the deployment logs and verify the deployed environment configuration.

## Public issue safety

Never paste API keys, cookies, passwords, access tokens, database credentials, private URLs, or sensitive browsing data into issues, screenshots, logs, or pull requests.
