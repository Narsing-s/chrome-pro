# Architecture

Chrome Pro is intentionally split into cooperating layers so browser UX remains usable even when an external service fails.

```text
User
 │
 ├── Chrome Pro Web UI (Next.js)
 │     ├── browser workspace
 │     ├── search experience
 │     ├── download/product surface
 │     └── /api/health
 │
 └── Chrome Pro Desktop (Electron)
       ├── native window management
       ├── Chromium BrowserViews
       ├── tab/navigation state
       ├── profile/incognito foundations
       └── narrow IPC bridge
                    │
                    ▼
             Search Provider
             Nova Search / SearXNG
```

## Web layer

The Next.js application provides the public product surface, browser-oriented workspace, search experience, responsive UI, health endpoint, and deployment surface.

Keep network-dependent UI states explicit: loading, success, empty, timeout, provider error, and fallback should not be conflated.

## Desktop layer

`desktop/main.js` owns the Electron main process and native browser lifecycle. It creates windows and Chromium `BrowserView` instances and coordinates browser state such as tabs, navigation, profiles, and window controls.

`desktop/preload.js` exposes a narrow renderer-to-main IPC surface. Node integration should remain disabled in untrusted UI content. New privileged functionality belongs behind validated IPC rather than direct renderer access.

## Search layer

Search is decoupled from the browser shell. The web application can remain open and ordinary URL navigation should remain useful when the search provider is unavailable.

The current adapter expects `/search?q=...&format=json` and uses a seven-second timeout. Provider-specific credentials must never be hard-coded into the client.

## Reliability model

Every external dependency should have:

- a bounded timeout
- a visible failure state
- a fallback where practical
- logs/diagnostics that do not expose secrets
- a health signal when the dependency is operationally important

A browser that cannot reach one backend should not become a blank or permanently blocked application.

## Security model

Treat every webpage as untrusted content. Minimize the renderer's privileges, validate IPC inputs, avoid exposing secrets, and keep security-sensitive decisions in trusted processes.

## Extension points

Future browser services should be independently replaceable where possible: search providers, AI providers, caching, telemetry/observability, update services, and account/profile services. This reduces vendor lock-in and allows reliability controls such as provider failover.
