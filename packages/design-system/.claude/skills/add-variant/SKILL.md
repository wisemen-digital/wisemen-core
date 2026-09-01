---
description: "Add a new variant value to an existing component's props, style, and story"
allowed-tools: ["Read", "Write", "Edit", "Glob", "Grep", "Bash"]
---

Add a new variant to an existing component. Arguments: "$ARGUMENTS" (format: "component-name variant-value", e.g., "button ghost" or "badge outline-primary").

## Before You Start

Read the component's `*.style.ts` file first — study how existing variants are structured so the new one matches exactly.

## Steps

1. **Parse arguments** — extract the component name and the variant to add.

2. **Read the component's files:**
   - `*.style.ts` — understand existing variants structure, slots, and compoundVariants
   - `*.props.ts` — understand existing prop types and union values

3. **Update the props type** in `*.props.ts`:
   - Add the new variant value to the relevant union type
   - Keep union members sorted alphabetically: `'destructive' | 'ghost' | 'primary' | 'secondary'`
   - Add JSDoc if the variant has specific semantics

4. **Update the style** in `*.style.ts`:

   Add the variant to the appropriate `variants` object. **Style every slot that other variants style** — don't leave slots empty.

   Example — adding `'ghost'` to button's `variant` axis:
   ```ts
   variants: {
     variant: {
       // ... existing variants ...
       'ghost': {                              // NEW — alphabetical position
         icon: `
           text-secondary
           group-disabled/button:text-disabled
         `,
         label: `
           text-secondary
           group-disabled/button:text-disabled
         `,
         loader: `
           text-secondary
           group-disabled/button:text-disabled
         `,
         root: `
           border-transparent bg-transparent
           focus-visible:outline-fg-brand-primary
           data-interactive:hover:bg-primary-hover
         `,
       },
     },
   },
   ```

   **Dark mode compound variants** — if other variants have `compoundVariants` entries, add entries for the new variant too:
   ```ts
   compoundVariants: [
     // ... existing entries ...
     {
       class: 'dark:rounded-[0.35rem]',       // NEW
       size: 'md',
       variant: 'ghost',
     },
   ],
   ```

   Token selection guidance:
   - Study existing variants' token patterns (colors, borders, backgrounds)
   - Match the semantic intent: destructive uses `error-*`, primary uses `brand-*`, secondary/tertiary use `text-secondary` + `bg-primary`
   - Always include: disabled states (`group-disabled/button:text-disabled`), interactive states (`data-interactive:hover:...`), focus states (`focus-visible:outline-...`)

5. **Update the story** in `*.story.ts`:
   - If an `AllVariants` story exists, add the new variant to the render function
   - If no `AllVariants` story exists, consider adding one
   - Add a dedicated story for the new variant if it has unique behavior

6. **Run validation:**
   ```
   pnpm lint:fix && pnpm type-check
   ```
   Fix any issues until both pass.

## Checklist before done
- [ ] Props file: new value added to union type
- [ ] Props file: union members sorted alphabetically
- [ ] Style: variant added to `variants` object in alphabetical position
- [ ] Style: every slot that other variants style is also styled for this variant
- [ ] Style: disabled, hover, and focus states included
- [ ] Style: dark mode `compoundVariants` added (if other variants have them)
- [ ] Story: `AllVariants` story updated (if exists)
- [ ] `pnpm lint:fix` passes
- [ ] `pnpm type-check` passes
