---
"@wisemen/opentelemetry": minor
---

Reduce default trace volume while preserving useful PostgreSQL query summaries

Redis `PING` keepalive spans are no longer exported. They are matched on their
`db.system` / `db.statement` attributes, so services that never registered the
response hook are covered too.

PostgreSQL spans never carry SQL text. Every query is summarized into a
low-cardinality `db.query.summary` (plus `db.operation.name` and, when
unambiguous, `db.collection.name`), and `db.statement` / `db.query.text` are
stripped before export, including on slow and failed queries.

The probe routes registered by `enableProbes` are no longer instrumented: `/health`,
`/ready`, and the version endpoint at `/` and `/api`.
