# Search Integration

Chrome Pro keeps search separate from browser rendering so a search-provider failure does not become a browser failure.

## Configure a provider

Set:

```text
SEARCH_ENGINE_URL=https://your-search-service.example
```

The current adapter expects the provider to support:

```text
GET /search?q=<query>&format=json
```

The web application applies a bounded request timeout and should keep the browser UI usable when the provider cannot be reached.

## Recommended test matrix

When changing search integration, test:

| Case | Expected behavior |
|---|---|
| Valid results | Results render clearly and links work |
| Empty results | Explain that nothing matched; do not show an infinite loader |
| Slow provider | Request ends within the configured timeout |
| HTTP error | Show a useful error/fallback state |
| Malformed JSON | Recover without breaking the page |
| Provider offline | Browser remains usable and fallback is offered |

## Local testing

Run the search service independently, configure `SEARCH_ENGINE_URL`, then start Chrome Pro. Test both direct URL navigation and search so a provider outage does not prevent ordinary browsing.

## Reliability direction

Planned improvements include provider failover, result-quality handling, caching, rate limiting, configurable providers, and privacy-preserving operational metrics. These are roadmap items unless the implementation is present in the repository.
