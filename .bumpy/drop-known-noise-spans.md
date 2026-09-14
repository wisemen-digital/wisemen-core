---
"@wisemen/opentelemetry": minor
---

Drop Redis keepalive and health-probe spans, and cap span attribute values at 2048 characters.

Three defaults change:

- `[Redis] PING` (all three historical name variants) is no longer exported. Opt out with `filterKnownNoiseSpans: false`.
- `GET /health` and `GET /ready` server spans are no longer created, via `ignoreIncomingRequestHook`.
- Span attribute values are truncated at 2048 characters, overridable with `attributeValueLengthLimit`.

The truncation matters most for bulk inserts: a single `pg.query:INSERT` span in `api-scheduler-import-cbe` carries a 195,903-character `db.statement` (1,000 rows, 12,000 placeholders), and that service alone is ~19% of all span bytes.

`shouldExportSpan` still works as before and is now composed with the built-in filter rather than replacing it.
