# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

This is a monorepo of ~70 independently-published packages under `packages/api/*`, `packages/web/*`, and `packages/payload/*`. Each package is its own bounded context — there is no shared ubiquitous language across e.g. `packages/web/auth` and `packages/api/monetary`. Domain modeling is therefore scoped **per package**, not per repo.

## Before exploring, read these

- **`packages/<group>/<package>/CONTEXT.md`** — the glossary for the package you're working in, if it exists.
- **`packages/<group>/<package>/docs/adr/`** — ADRs scoped to that package, if any exist.

If either doesn't exist for the package you're touching, **proceed silently**. Don't flag their absence; don't suggest creating them upfront. The `domain-modeling` skill creates them lazily when terms or decisions actually get resolved during a session.

## File structure

```
packages/
├── api/
│   └── monetary/
│       ├── CONTEXT.md
│       ├── docs/adr/
│       │   └── 0001-decimal-storage.md
│       └── src/
└── web/
    └── auth/
        ├── CONTEXT.md
        ├── docs/adr/
        └── src/
```

There is no repo-root `CONTEXT.md` or `CONTEXT-MAP.md`. Each package's own root is that context's home.

## Use the glossary's vocabulary

When your output names a domain concept (in an issue title, a refactor proposal, a hypothesis, a test name) for a given package, use the term as defined in that package's `CONTEXT.md`. Don't drift to synonyms the glossary explicitly avoids.

If the concept you need isn't in the glossary yet, that's a signal — either you're inventing language the package doesn't use (reconsider) or there's a real gap (note it for `domain-modeling`).

## Flag ADR conflicts

If your output contradicts an existing ADR in the package you're working on, surface it explicitly rather than silently overriding:

> _Contradicts ADR-0007 (decimal storage) — but worth reopening because…_
