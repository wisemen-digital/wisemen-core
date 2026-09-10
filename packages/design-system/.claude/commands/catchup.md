---
description: Rebuild context after /clear by reading all branch changes
---
Read all files changed in the current branch to rebuild context.

1. Find the base branch:
   - `git merge-base HEAD main`

2. Get all changed files (committed + uncommitted):
   - `git diff --name-only $(git merge-base HEAD main) HEAD`
   - `git diff --name-only`
   - `git diff --name-only --staged`

3. Read each changed file in full.

4. Summarize:
   - Which components are being worked on
   - What's done vs what appears remaining
   - Any TODOs, lint errors, or type errors in the code
   - Current state of `src/ui/index.ts` exports

Do NOT suggest changes — just understand and summarize.
