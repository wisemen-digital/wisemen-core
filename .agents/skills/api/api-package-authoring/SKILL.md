---
name: api-package-authoring
description: Use when creating or updating api specific packages in `packages/api/*`, especially for package structure, exports, module wiring, docs, and validation.
---

# API Package Authoring

Use this skill when the task is to add or refine a reusable package under `packages/api/*`.

## Goals

- Match the existing conventions already used by nearby `packages/api/*` packages.
- Prefer the smallest package surface that satisfies current consumers.
- Keep package internals simple, readable, and easy to validate.

## Workflow

1. Inspect 2-3 nearby `packages/api/*` packages that are structurally similar.
2. Match their file layout, naming, exports, and module option patterns.
3. Reuse existing repo primitives before introducing new abstractions.
4. Keep package-local helpers private unless multiple files truly share them.
5. Before committing, create or update a `.bumpy/*.md` file for the logical change.
6. Use `pnpm bumpy add --packages "<pkg1>:<bump>,<pkg2>:<bump>" --message "<summary>" --name "<slug>"` for non-interactive runs, or update the existing bump file in place if the branch already has one for the same change.
7. Choose bump levels deliberately: `major` for breaking API changes, `minor` for new user-facing capabilities, and `patch` for fixes, dependency updates, and internal refactors.
8. Keep the bump message short and changelog-ready. Describe the user-facing impact, not the implementation detail.
9. Add or update concise package docs only where the repo convention already expects them.
10. Run focused validation for the package you touched.

## Defaults

- Prefer repo-native patterns over generic library patterns.
- Prefer `type` imports where appropriate.
- Keep public options minimal; expose only what real consumers need.
- Avoid introducing new dependencies unless the repo clearly benefits.

## Validation

- Run focused `tsc`, `eslint`, and `oxlint` checks for the package.
- If a package refactor changes exports or file splits, verify the barrel and module wiring explicitly.
- Make sure the bump file still matches the final package scope and bump levels before staging the PR.
