# Architecture

Chrome Pro is split into three cooperating layers.

```text
User
  │
  ├── Chrome Pro Web UI (Next.js)
  │      ├── browser workspace
  │      ├── search experience
  │      └── health endpoint
  │
  └── Chrome Pro Desktop (Electron)
         ├── native window management
         ├── Chromium BrowserViews
         ├── profiles / incognito sessions
         └── IPC bridge
                    │
                    ▼
             Search Provider
             Nova Search / SearXNG
```

## Web layer

The Next.js application provides the browser-oriented workspace, search experience, responsive UI, API health endpoint, and deployment surface.

## Desktop layer

`desktop/main.js` owns the Electron main process. It creates native windows and Chromium `BrowserView` instances, maintains tab state, profiles, incognito sessions, navigation, bookmarks, history, and window controls.

`desktop/preload.js` exposes the narrow renderer-to-main IPC API used by the browser UI. Node integration remains disabled in the UI renderer.

## Search layer

Search is intentionally decoupled from the browser shell. A provider outage should not prevent the application from opening or navigating to ordinary websites.

## Reliability principle

The browser client should fail gracefully. Network-dependent capabilities must have timeouts, visible error states, and a usable fallback whenever practical.

## Security principle

Treat every webpage as untrusted content. Keep privileged Electron APIs behind a minimal preload bridge and validate IPC inputs in the main process as the project grows.
