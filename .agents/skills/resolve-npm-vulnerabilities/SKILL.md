---
name: resolve-npm-vulnerabilities
description: Resolve npm vulnerabilities. Use when auditing and resolving vulnerabilities.
---

## Workflow

Do not run pnpm audit before performing this workflow.

1. Run the resolver script:
   ```bash
   bash .agents/skills/resolve-npm-vulnerabilities/scripts/fix-npm-vulnerabilities.sh 
   ```

2. Fix build and type errors that are a result of the package updates.