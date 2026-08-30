# Web Platform

The web application is the browser workspace and control plane for Chrome Pro. It is built with Next.js.

## Responsibilities

- Browser-oriented workspace UI
- Search experience
- Responsive presentation
- Health endpoint
- Integration with the search service
- Deployment configuration

## Local development

```bash
npm install
npm run dev
```

Build validation:

```bash
npm run build
```

## Configuration

Use environment variables for service endpoints. Keep local secrets in environment files that are excluded from source control.

## Reliability expectations

The UI should not become unusable because an upstream search or AI service is unavailable. Loading, empty, timeout, and provider-error states should be explicit and recoverable.
