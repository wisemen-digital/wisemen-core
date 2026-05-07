# Authoring Skills

This guide is for maintainers of `@wisemen/*` packages. It covers how to ship AI coding skills alongside your package so consumer projects can pull them in via `@wisemen/skills-cli`.

## What is a "skill"?

A skill is a single Markdown file (`SKILL.md`) that documents one focused capability of a package — how to do *one thing* with it, written for an LLM coding assistant. Skills are NOT API reference and NOT tutorials. They're surgical: "how do I write a TanStack mutation with `useMutation`", not "everything you need to know about mutations".

Each skill ships in your package's npm tarball. When a consumer installs your package, `@wisemen/skills-cli` picks the skill up and renders it for whatever LLM they use (Claude Code, generic `AGENTS.md`, `llms.txt`, …).

## Layout

Each producer package owns a top-level `skills/` directory:

```
packages/{web,api}/<your-package>/
├── package.json
├── src/
└── skills/
    ├── <skill-name>/SKILL.md
    └── <other-skill>/SKILL.md
```

Reference: [`packages/web/api-utils/skills/`](../../../packages/web/api-utils/skills/) and [`packages/web/formango/skills/`](../../../packages/web/formango/skills/).

## SKILL.md format

Each `SKILL.md` is a YAML frontmatter block followed by Markdown.

```markdown
---
name: writing-mutations
description: Create, update, delete resources using factory-provided useMutation, typed queryKeysToInvalidate, AsyncResult error handling.
type: core
library: vue-core-api-utils
library_version: ">=1.0.0 <2.0.0"
sources:
  - "wisemen-digital/wisemen-core:packages/web/api-utils/src/composables/useMutation.ts"
requires:
  - foundations
---

# Writing Mutations

…body…
```

### Required frontmatter fields

| Field | Required | Notes |
|-------|----------|-------|
| `name` | yes | Kebab-case, unique within the package. Becomes the directory name and the skill identifier. |
| `description` | yes | One paragraph. Shown in indexes (`AGENTS.md`, `llms.txt`, IDE skill pickers). Lead with concrete API/method names so LLMs can match user requests. |

### Optional frontmatter fields

| Field | Notes |
|-------|-------|
| `type` | Free-form classification (`core`, `lifecycle`, `composition`, etc.). |
| `library` | The package this skill describes. Defaults to the surrounding package. |
| `library_version` | **Informational only** — describes which version the skill was authored against. The CLI does NOT filter on it (skills always travel with the package version that bundled them). Use a SemVer range when authoring against a stable surface; an exact version is fine for early/breaking work. |
| `sources` | List of source files this skill is based on (use `<repo>:<path>` so the references survive moves). |
| `requires` | Other skill names (in this same package) that should be read first. |

Any additional keys you put in frontmatter are preserved in the rendered output — useful for editor-specific annotations.

## Shipping skills with your package

In your `package.json`:

```jsonc
{
  "files": [
    "dist",
    "skills"        // <-- include skills in the npm tarball
  ]
}
```

Verify with `pnpm pack --dry-run`: the output should include every `skills/<name>/SKILL.md`.

## Naming conventions

- **Skill names** are kebab-case: `writing-mutations`, `array-fields`, `transaction-pattern`.
- Avoid leading verbs that describe the document ("guide-to-X", "intro-X"). Lead with the *thing* (`writing-mutations`, not `guide-to-mutations`).
- One skill = one focused capability. If you find yourself writing four sub-headings about unrelated topics, split into multiple skills and use `requires` to link them.

## Writing style

- Lead with concrete code. LLMs match user intent by recognizing API names and call sites — bury the "philosophy" sections beneath the working examples.
- Show the canonical pattern; show 1-2 anti-patterns to avoid; stop. Skills are not tutorials.
- Cite source files in `sources:` so future authors can verify the skill is still accurate after refactors.
- Cap each skill at ~150 lines of body. If it grows beyond that, split it.

## Versioning

Skills travel with your package. Bumping your package version automatically updates the skills consumers pick up — no separate release.

If a skill becomes wrong on a new version, edit it in the same PR that changes the underlying behaviour. Add a changeset entry that mentions the skill update so consumers see it in the changelog.

## Consumer experience

Once your skills ship, a consumer who has `@wisemen/skills-cli` set up runs `pnpm skills:sync` (or relies on their `postinstall` hook). They get:

- `.agents/skills/<your-package-short-name>/<skill>/SKILL.md` — for Claude Code.
- A regenerated `## Skills from @wisemen packages` section in `AGENTS.md` — for Codex/Aider/Zed.
- An `llms.txt` index entry — for the emerging cross-LLM standard.

You don't need to know which adapters they use. Author the skill once; the CLI handles the rest.

## Further reading

- CLI: [`packages/tools/skills-cli/`](../../../packages/tools/skills-cli/)
- Working examples: [`packages/web/api-utils/skills/`](../../../packages/web/api-utils/skills/), [`packages/web/formango/skills/`](../../../packages/web/formango/skills/)
