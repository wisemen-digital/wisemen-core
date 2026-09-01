---
description: Run type-check, lint, and test — report results
allowed-tools: ["Bash"]
---
# Check

Run all project validation checks and report results.

Run these sequentially:
1. `pnpm type-check`
2. `pnpm lint:fix`
3. `pnpm test` (if tests exist)

For each: report pass/fail with a clear summary. If anything fails, show the first few errors and suggest fixes.

At the end, give a one-line verdict: ALL PASSING or N ISSUES FOUND.
