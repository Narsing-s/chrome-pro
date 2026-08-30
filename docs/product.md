# Product Overview

## What is Chrome Pro?

Chrome Pro is an independent browser project that combines a familiar Chromium-based desktop browsing experience with a modern web control plane and a resilient search layer.

The product is deliberately **powerful without being complicated**: everyday users should be able to open a page, search, navigate, and manage tabs without learning a complex system, while advanced users and contributors get clear extension points for future capabilities.

## Who it is for

- Everyday users who want a clean browser experience.
- Power users who want stronger controls and future customization.
- Developers interested in browser shells, search systems, privacy, performance, and desktop UX.
- Contributors who want a project with visible product feedback and an approachable codebase.

## Experience goals

### Simple first run

The first screen should make the primary action obvious: enter a URL or search query. Empty states should explain what to do next rather than expose implementation details.

### Fast and predictable navigation

Back, forward, reload, tabs, and the address/search bar should behave consistently. Network failures should be visible without trapping the user in a broken screen.

### Clear power features

Advanced features should be discoverable but not clutter the default interface. Settings, privacy controls, profiles, downloads, bookmarks, history, and AI capabilities should grow behind understandable controls.

### Trust and privacy

Web content is untrusted. Privileged desktop APIs must stay behind the Electron main/preload boundary. Secrets must never be stored in the repository or exposed to the renderer unnecessarily.

## What is shipped vs planned

**Shipped foundations:** web UI, search routing, resilient search fallback, health endpoint, Electron desktop shell, Chromium BrowserViews, navigation/tab foundations, profiles/incognito foundations, CI/release workflows, and contributor documentation.

**Planned:** richer session restoration, mature bookmarks/history/download management, permission controls, privacy features, AI provider failover, caching/rate limiting, observability, signed installers, auto-updates, accessibility improvements, and broader platform polish.

## Success signals

Product decisions should be informed by:

- successful startup and navigation
- low frequency of unrecoverable UI states
- search reliability and latency
- crash/error reports
- accessibility feedback
- user requests and recurring GitHub Issues
- contributor participation and successful pull requests

Avoid vanity metrics. A feature is successful when it makes a real browsing task clearer, faster, safer, or more reliable.
