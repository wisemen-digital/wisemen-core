---
description: "Audit all barrel exports for missing components, naming violations, and inconsistent patterns"
allowed-tools: ["Read", "Glob", "Grep", "Bash"]
---

Audit all barrel exports for correctness and completeness.

## Steps

1. **Read the barrel export chain:**
   - `src/index.ts` — top-level entry point
   - `src/ui/index.ts` — public component barrel

2. **Scan all component directories** under `src/ui/`:
   - Read every `index.ts` file in each component folder
   - Catalog all exported symbols (components, types, style creators)

3. **Run these checks:**

### Barrel chain integrity
- [ ] `src/index.ts` re-exports from `./ui`
- [ ] `src/ui/index.ts` lists all public components
- [ ] Every listed component folder has an `index.ts`

### Naming conventions
- [ ] All component exports use `UI` prefix: `UIButton`, `UITextField`
- [ ] All prop type exports use `UI` prefix + `Props` suffix: `UIButtonProps`, `UITextFieldProps`
- [ ] All prop types use the `type` keyword: `export { type XProps as UIXProps }`
- [ ] No default exports from barrel files (only named re-exports)

### Completeness
- [ ] Every component folder with an `index.ts` that exports public symbols is listed in `src/ui/index.ts`
- [ ] No component is accidentally excluded (compare folder list vs export list)
- [ ] No internal-only components are accidentally exposed (e.g., `field-wrapper`, `input-wrapper` should typically NOT be in the public barrel unless intended)

### Consistency
- [ ] Export patterns are consistent across all components:
  ```ts
  // Expected pattern:
  export { type {PascalName}Props as UI{PascalName}Props } from './{camelName}.props'
  export { default as UI{PascalName} } from './{PascalName}.vue'
  ```
- [ ] Sub-components that are part of a compound component are exported alongside the root:
  ```ts
  export { default as UIDropdownMenu } from './DropdownMenu.vue'
  export { default as UIDropdownMenuItem } from './DropdownMenuItem.vue'
  ```
- [ ] Style creators are exported if intended for external customization

### Potential issues
- [ ] No circular imports between component folders
- [ ] No duplicate export names across different components
- [ ] Import paths use `./` relative format (not `@/` aliases in barrel files)

4. **Output a structured report:**
   ```
   ## Export Audit

   ### Public Components (src/ui/index.ts)
   ✅ button — UIButton, UIButtonProps, UIIconButton, UIIconButtonProps, UILink, UILinkProps
   ✅ text-field — UITextField, UITextFieldProps
   ⚠️ badge — folder exists with index.ts but NOT in src/ui/index.ts

   ### Naming ✅ (or ⚠️ N violations)
   - badge/index.ts: exports `Badge` without `UI` prefix

   ### Internal Components (intentionally not exported)
   ℹ️ field-wrapper, input-wrapper, action-tooltip, ...

   ### Summary
   - X public components exported
   - Y component folders exist
   - Z components not exported (verify intentional)
   - N naming violations
   ```

5. **Offer to fix** any issues. If the user agrees:
   - Add missing exports to `src/ui/index.ts`
   - Fix naming convention violations in component `index.ts` files
   - Run `pnpm lint:fix && pnpm type-check`
