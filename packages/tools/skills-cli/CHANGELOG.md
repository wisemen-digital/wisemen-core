# @wisemen/skills-cli




## 0.1.3
<sub>2026-08-27</sub>

- [#1615](https://github.com/wisemen-digital/wisemen-core/pull/1615)  *(patch)* Thanks [@app/ernest-app](https://github.com/app/ernest-app)! - Resolve npm vulnerabilities (handlebars, mailpit-api, js-yaml, dayjs, fastify, @typescript-eslint/parser)

## 0.1.2
<sub>2026-06-30</sub>

- [#1321](https://github.com/wisemen-digital/wisemen-core/pull/1321)  *(patch)* Thanks [@Kobe-Kwanten](https://github.com/Kobe-Kwanten)! - chore: bump dependencies to resolve vulnerabilities

## 0.1.1
<sub>2026-06-17</sub>

- [#1286](https://github.com/wisemen-digital/wisemen-core/pull/1286)  *(patch)* Thanks [@Kobe-Kwanten](https://github.com/Kobe-Kwanten)! - fix: change skills-clie name to what pnpm in docker files expects

## 0.1.0

### Minor Changes

- [#1009](https://github.com/wisemen-digital/wisemen-core/pull/1009) [`713b049`](https://github.com/wisemen-digital/wisemen-core/commit/713b04978aa1e960290c755062ce1b5b9e2fdafe) Thanks [@JeroenVanC](https://github.com/JeroenVanC)! - Initial release. CLI that pulls AI coding skills from installed `@wisemen/*` packages and renders them per LLM target (Claude Code, `AGENTS.md`, `llms.txt`).
  - `wisemen-skills sync` — scan `node_modules/@wisemen/*`, render skills to all configured adapters, write a `.wisemen-skills.lock.json` lockfile.
  - `wisemen-skills check` — exits non-zero if any output would change (use in CI).
  - `wisemen-skills list` — print the discovered skills per package.

  See [`docs/packages/_meta/authoring-skills.md`](../docs/packages/_meta/authoring-skills.md) for the producer-side contract.
