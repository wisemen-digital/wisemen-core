---
description: Create a PR with auto-generated description from branch changes
allowed-tools: ["Bash"]
---
# Create PR

Create a pull request for the current branch.

1. Verify the branch is not `main` — refuse if it is
2. Push the branch if not already pushed: `git push -u origin HEAD`
3. Read all commits on this branch: `git log main..HEAD --oneline`
4. Read the full diff: `git diff main...HEAD`
5. Identify what changed:
   - New components added (new directories under `src/ui/`)
   - Components modified
   - Stories added or updated
   - Export changes in `src/ui/index.ts`
   - Style/token changes
6. Generate a PR with `gh pr create`:
   - **Title**: concise summary under 70 chars (e.g., "feat: add UIToggle component", "fix: dark mode tokens in Badge")
   - **Body**: structured summary:
     ```
     ## Summary
     - [what changed and why]

     ## Components
     - [list of new/modified components]

     ## Checklist
     - [ ] `pnpm type-check` passes
     - [ ] `pnpm lint:fix` passes
     - [ ] Stories added/updated
     - [ ] Dark mode supported
     - [ ] Exports added to `src/ui/index.ts`
     ```
7. Return the PR URL
