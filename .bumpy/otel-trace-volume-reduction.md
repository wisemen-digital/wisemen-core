---
"@wisemen/opentelemetry": minor
---

Reduce default trace volume while preserving useful PostgreSQL query summaries

Redis `PING` keepalive spans are no longer exported. They are matched on their
`db.system` / `db.statement` attributes, so services that never registered the
response hook are covered too.

The probe routes registered by `enableProbes` are no longer instrumented: `/health`,
`/ready`, and the version endpoint at `/` and `/api`.
