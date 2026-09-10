---
description: "Scan a component for hardcoded colors, spacing, radius, and font values that should use design tokens"
allowed-tools: ["Read", "Glob", "Grep", "Bash"]
---

Audit the component at "$ARGUMENTS" for hardcoded values that should use design tokens.

## Steps

1. **Resolve the component** — find the directory under `src/ui/` matching `$ARGUMENTS`. Read ALL files in the component directory.

2. **Read the token reference files:**
   - `src/styles/core/tokens.css` — all available design tokens (spacing, radius, shadows, font sizes, font weights, line heights)
   - `src/styles/core/colors.css` — semantic color tokens (light + dark theme)

3. **Scan all `.style.ts` files** in the component for these violations:

### Color violations
- [ ] **Hardcoded hex colors** — e.g., `#ff0000`, `#333`, `rgba(...)` → should use semantic tokens like `text-primary`, `bg-error-primary`, `border-brand`, `text-fg-error-primary`
- [ ] **Tailwind default colors** — e.g., `text-red-500`, `bg-blue-100`, `border-green-300` → should use semantic tokens: `brand-*`, `error-*`, `success-*`, `warning-*`, `gray-*`
- [ ] **Missing dark mode** — uses a color that changes between themes but has no `dark:` override or `compoundVariants` entry

### Spacing violations
- [ ] **Tailwind numeric spacing** — e.g., `p-4`, `gap-2`, `m-8` → should use custom tokens: `p-md`, `gap-sm`, `m-xl`
- [ ] **Hardcoded rem/px** — e.g., `p-[16px]`, `gap-[0.5rem]` → should use tokens: `p-xl`, `gap-md`

**Valid spacing tokens:** `none`, `xxs` (2px), `xs` (4px), `sm` (6px), `md` (8px), `lg` (12px), `xl` (16px), `2xl` (20px), `3xl` (24px), `4xl` (32px), `5xl` (40px), `6xl` (48px), `7xl` (64px), `8xl` (80px), `9xl` (96px), `10xl` (128px), `11xl` (160px)

### Border radius violations
- [ ] **Tailwind default radius** — e.g., `rounded`, `rounded-lg` → should use custom tokens: `rounded-md`, `rounded-lg` (verify they map to the custom scale)

**Valid radius tokens:** `none` (0), `xxs` (2px), `xs` (4px), `sm` (6px), `md` (8px), `lg` (10px), `xl` (12px), `2xl` (16px), `3xl` (20px), `4xl` (24px), `full` (1000px)

### Font violations
- [ ] **Hardcoded font sizes** — e.g., `text-[14px]` → should use `text-xs`, `text-sm`, `text-md`, etc.
- [ ] **Hardcoded font weights** — e.g., `font-[500]` → should use `font-regular` (400), `font-medium` (500), `font-semibold` (600), `font-bold` (700)

### Shadow violations
- [ ] **Hardcoded box-shadows** — e.g., `shadow-[...]` → should use `shadow-xs`, `shadow-sm`, `shadow`, `shadow-lg`

4. **Also scan `.vue` template** for:
   - Inline styles with hardcoded values
   - Class attributes with hardcoded Tailwind values that bypass the style file

5. **Output a structured report:**
   ```
   ## Token Audit: {name}

   ### Colors ✅ (or ⚠️ N violations)
   - Line X: `text-red-500` → use `text-error-primary`
   - Line Y: `#333` → use `text-primary`

   ### Spacing ✅ (or ⚠️ N violations)
   - Line X: `p-4` → use `p-xl`

   ### Border Radius ✅
   ### Fonts ✅
   ### Shadows ✅
   ### Dark Mode ✅ (or ⚠️ N missing)
   - Line X: uses `bg-brand-primary` but no dark mode override

   ### Summary: N violations found
   ```

6. **Offer to fix** any violations automatically. If the user agrees, make the changes and run `pnpm lint:fix && pnpm type-check`.
