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

## SKILL.md format

Each `SKILL.md` is a YAML frontmatter block followed by Markdown.

```markdown
---
name: writing-mutations
description: Create, update, or delete resources with the api-utils `useMutation` composable — typed `queryKeysToInvalidate`, an awaitable `execute()`, and AsyncResult error handling. Use this whenever wiring a create/update/delete call or invalidating cached queries after a write.
---

# Writing Mutations

…body…

## Skill metadata

- **Library:** `@wisemen/vue-core-api-utils` (package `vue-core-api-utils`)
- **Type:** core
- **Authored against:** v1.2.0
- **Prerequisites:** [`foundations`](../foundations/SKILL.md)
- **Sources:**
  - `packages/web/api-utils/src/composables/mutation/mutation.composable.ts`
```

### Frontmatter: only `name` and `description`

Keep the frontmatter to exactly these two fields. They are the **only** part of a skill an assistant reads when *deciding whether to use it* — the body is loaded only after the skill is selected. So the `description` has to carry all the triggering signal, and everything else (version, sources, prerequisites, classification) belongs in the body, where it is read once the skill is in use.

| Field | Required | Notes |
|-------|----------|-------|
| `name` | yes | Kebab-case, unique within the package. Matches the directory name and is the skill identifier. |
| `description` | yes | One paragraph that doubles as the trigger. Lead with concrete API/method names so an assistant matches user intent, then say *when* to use the skill ("Use this when…") — be specific and a little pushy, since skills tend to under-trigger. Shown in indexes (`AGENTS.md`, `llms.txt`, IDE skill pickers). |

The CLI requires only `name` and `description`; any other frontmatter keys are ignored by tooling and just bloat the always-loaded selection budget. Put supplementary metadata in a `## Skill metadata` section at the **end of the body** instead:

| Old frontmatter field | Now in the body as |
|-----------------------|--------------------|
| `type` | a `**Type:**` line (free-form: `core`, `lifecycle`, …) |
| `library` | a `**Library:**` line (the package the skill describes) |
| `library_version` | an `**Authored against:**` line — informational only; skills travel with the package version that bundled them |
| `sources` | a `**Sources:**` list citing the source files the skill is based on |
| `requires` | a `**Prerequisites:**` link to the prerequisite skill(s), plus a one-line "Read _X_ first." pointer near the top of the body |

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
- One skill = one focused capability. If you find yourself writing four sub-headings about unrelated topics, split into multiple skills and link them with a **Prerequisites** line in each skill's `## Skill metadata` section.

## Writing style

- Lead with concrete code. LLMs match user intent by recognizing API names and call sites — bury the "philosophy" sections beneath the working examples.
- Show the canonical pattern; show 1-2 anti-patterns to avoid; stop. Skills are not tutorials.
- Cite the source files a skill is based on in its `## Skill metadata` section so future authors can verify it after refactors.
- Keep each skill focused on one capability and let depth serve correctness — include everything an assistant needs to implement the task right. Split a skill when it starts covering *unrelated* capabilities, not merely when it gets long.

## Versioning

Skills travel with your package. Bumping your package version automatically updates the skills consumers pick up — no separate release.

If a skill becomes wrong on a new version, edit it in the same PR that changes the underlying behaviour. Add a changeset entry that mentions the skill update so consumers see it in the changelog.

## Consumer experience

Once your skills ship, a consumer who has `@wisemen/skills-cli` set up runs `pnpm skills:sync` (or relies on their `postinstall` hook). They get:

- `.agents/skills/<your-package-short-name>/<skill>/SKILL.md` — for Claude Code.
- A regenerated `## Skills from @wisemen packages` section in `AGENTS.md` — for Codex/Aider/Zed.
- An `llms.txt` index entry — for the emerging cross-LLM standard.

You don't need to know which adapters they use. Author the skill once; the CLI handles the rest.
