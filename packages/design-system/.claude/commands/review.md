---
description: Review current branch changes for design system convention violations
---
# Review

Review all changes on the current branch against design system conventions.

1. Get the diff: `git diff main...HEAD` plus any uncommitted changes (`git diff`)
2. Identify which component directories were touched
3. For each changed component, run the full audit:
   - Read ALL files in the component directory (not just the diff)
   - Check against the conventions in `CLAUDE.md`
   - Reference `.claude/skills/review-component/SKILL.md` for the checklist
   - Reference `.claude/skills/audit-tokens/SKILL.md` for token violations
   - Reference `.claude/skills/review-exports/SKILL.md` for export correctness
4. Also check for project-wide issues:
   - `src/ui/index.ts` — are new components exported?
   - Any `import` from `tailwind-variants` instead of `@/styles/tailwindVariants.lib`?
   - Any old `xxxVariants` naming instead of `createXxxStyle`?
   - Any manual Symbol-based context instead of `useContext` factory?
5. Report findings grouped by severity:
   - **Blocking**: Must fix before merge
   - **Warning**: Should fix
   - **Note**: Optional improvements
6. For each finding, include file path, line number, and suggested fix.

Be concise. Don't flag things that are fine.
