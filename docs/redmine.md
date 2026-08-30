# Redmine Project Management

This page defines a clean way to mirror Chrome Pro engineering work into Redmine without turning GitHub into a duplicate task system.

## Suggested project description

> **Chrome Pro** is an independent, user-first browser project built around a Chromium-powered Electron desktop shell, a Next.js web control plane, and a resilient search layer. The project aims to deliver a familiar browsing experience with stronger usability, privacy, reliability, accessibility, and future power features. Chrome Pro is open to user feedback and community contributions, with GitHub used for source collaboration and Redmine used for structured planning, milestones, dependencies, and operational tracking.

## Workstream structure

Use Redmine categories such as:

- **Web Platform** — Next.js UI, API routes, responsive experience, deployment.
- **Desktop Browser** — Electron main process, tabs, navigation, profiles, downloads.
- **Search** — Nova Search/SearXNG integration, fallback behavior, latency.
- **Security & Privacy** — permissions, isolation, secure defaults, vulnerability handling.
- **Reliability** — health checks, timeouts, crash/error handling, monitoring, release safety.
- **UX & Accessibility** — visual hierarchy, keyboard navigation, responsive behavior, localization.
- **Documentation & Community** — guides, issue quality, contributor onboarding, feedback.
- **Release Engineering** — CI, packaging, signed installers, update channels.

## Issue template

**Title:** `[area] concise user-facing outcome`

**Problem**

What user/developer problem exists?

**Expected outcome**

What should be different when the work is complete?

**Acceptance criteria**

- [ ] Behavior is implemented.
- [ ] Failure/empty states are handled.
- [ ] Relevant tests/checks pass.
- [ ] Documentation is updated.
- [ ] UI changes include screenshots/recording where useful.

**Evidence**

Link the related GitHub issue/PR, logs, measurements, screenshots, or reproduction steps.

## Suggested milestones

### M1 — Reliable core

Navigation, tabs, search fallback, health checks, startup stability, error handling, and baseline security.

### M2 — Everyday browser

Bookmarks, history, downloads, session restoration, profiles, permissions, and polished settings.

### M3 — Power platform

AI gateway, provider failover, privacy controls, observability, performance work, accessibility, and extensibility.

### M4 — Distribution

Signed installers, auto-update channels, release verification, support documentation, and multi-platform hardening.

## GitHub ↔ Redmine rule

Keep source-level discussion and code review in GitHub. Use Redmine for milestones, dependencies, cross-cutting work, release planning, and operational ownership. Link the two rather than copying entire conversations.
