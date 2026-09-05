---
"@wisemen/opentelemetry": patch
---

Capture the `Origin` request header on incoming server spans

A rejected CORS request currently produces a span with no way to tell *who* was rejected. The span carries the endpoint, method, status and client address, but `http_url`'s host is the API's own host — not the caller's — so nothing in the trace identifies the origin that was blocked.

`HttpInstrumentation` captures request headers only when explicitly configured to. This adds a single header to that allowlist:

```ts
headersToSpanAttributes: {
  server: { requestHeaders: ['origin'] }
}
```

Server spans now carry `http.request.header.origin`, which makes a blocked origin identifiable from the trace alone, and also shows which frontend calls which endpoint when nothing is broken — useful for getting `CORS_ALLOWED_ORIGINS` right in the first place rather than reacting to breakage.

Deliberately one header, not a wildcard. OpenTelemetry's semantic conventions class `http.request.header.<key>` as opt-in and state that instrumentations "SHOULD require explicit configuration of which headers are to be captured, as including all request headers can be a security risk". `origin` is low-cardinality — a handful of distinct values per service — and carries nothing sensitive. `authorization` and `cookie` are not captured and must not be added.

Verified against a live request carrying `Origin`, `Authorization` and `Cookie`: the span attributes contain `http.request.header.origin` with the origin value, and no `authorization` or `cookie` attribute.
