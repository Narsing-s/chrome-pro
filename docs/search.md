# Search Integration

Chrome Pro separates search from browser rendering so search failures do not become browser failures.

## Provider

Configure:

```text
SEARCH_ENGINE_URL=https://your-search-service.example
```

The current adapter expects a search endpoint that accepts `q` and can return JSON using `format=json`.

## Failure behavior

Search requests should use a bounded timeout. When the provider is unavailable, the UI should remain responsive and provide an understandable fallback rather than an endless loading state.

## Local testing

Run the search service independently, configure `SEARCH_ENGINE_URL`, then start Chrome Pro. Test successful results, empty results, malformed responses, slow responses, HTTP errors, and complete provider downtime.

## Future direction

Potential improvements include provider failover, result quality scoring, caching, rate limiting, privacy-preserving telemetry, and configurable search providers.
