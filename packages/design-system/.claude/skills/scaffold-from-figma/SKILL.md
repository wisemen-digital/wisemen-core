---
description: "Scaffold a component from a Figma design URL — extracts variants, tokens, and structure, then generates all component files"
allowed-tools: ["Read", "Write", "Edit", "Glob", "Grep", "Bash", "mcp__claude_ai_Figma__get_design_context", "mcp__claude_ai_Figma__get_screenshot", "mcp__claude_ai_Figma__get_metadata"]
---

Scaffold a component from a Figma design. Arguments: "$ARGUMENTS" (a Figma URL and optionally a component name, e.g., "https://figma.com/design/abc123/file?node-id=1-2 date-picker").

## Steps

1. **Parse arguments** — extract:
   - Figma URL (required)
   - Component name (optional — if not provided, infer from Figma node name)

2. **Extract fileKey and nodeId** from the Figma URL:
   - `figma.com/design/:fileKey/:fileName?node-id=:nodeId` → convert `-` to `:` in nodeId
   - `figma.com/design/:fileKey/branch/:branchKey/:fileName` → use branchKey as fileKey

3. **Fetch the Figma design** using MCP tools:
   - Call `get_design_context` with `fileKey` and `nodeId` to get code, screenshot, and contextual hints
   - Call `get_screenshot` with `fileKey` and `nodeId` for visual reference

4. **Analyze the design** and extract:
   - **Component structure** — is it simple (single element) or compound (parts pattern)?
   - **Variants** — identify size, color, state, and style variants from Figma variants/component set
   - **Props** — map Figma properties to TypeScript props
   - **Colors** — map Figma fills/strokes to semantic tokens (`brand-*`, `error-*`, `success-*`, `warning-*`, `gray-*`, `fg-*`, `bg-*`, `border-*`)
   - **Spacing** — map Figma auto-layout padding/gap to custom spacing tokens (`none`–`11xl`)
   - **Typography** — map Figma text styles to `text-xxs`–`text-7xl` and `font-regular`/`medium`/`semibold`/`bold`
   - **Border radius** — map to `rounded-none`–`rounded-full`
   - **Icons** — identify icon usage, will use `@wisemen/vue-core-icons`
   - **States** — default, hover, focus, disabled, loading, error, readonly

5. **Present the analysis** to the user before generating code:
   ```
   ## Figma Analysis: {ComponentName}

   **Structure:** Simple / Compound (with parts: ...)
   **Variants:** size (sm, md), variant (primary, secondary), ...
   **Props:** label: string, isDisabled: boolean, ...
   **Tokens mapped:**
   - Background: bg-primary → bg-brand-solid
   - Text: text-primary, text-secondary
   - Spacing: p-lg, gap-md
   - Radius: rounded-lg
   ```

6. **Ask the user** to confirm or adjust the analysis before proceeding.

7. **Determine which creation skill to use:**
   - If it's a form input (has label, error, hint, InputWrapper/FieldWrapper pattern) → follow the `create-form-input` pattern
   - If it's a regular component → follow the `create-component` pattern
   - If it's extending an existing component → follow the `create-sub-component` pattern

8. **Read the reference files** for the chosen pattern:
   - For regular components: `src/ui/badge/` files
   - For form inputs: `src/ui/text-field/` files
   - For Reka UI wrappers: `src/ui/number-field/` or `src/ui/dropdown-menu/` files

9. **Generate all files** following the exact patterns from the reference, but with:
   - Props, variants, and styles derived from the Figma analysis
   - Semantic tokens (NEVER hardcoded colors/spacing)
   - Dark mode compound variants for all color-dependent styles
   - Complete Storybook stories covering all Figma variants

10. **Add export** to `src/ui/index.ts` (alphabetically sorted).

11. **Run validation:**
    ```
    pnpm lint:fix && pnpm type-check
    ```
    Fix any issues until both pass.

12. **Compare visually** — if possible, show the user the Storybook output alongside the Figma screenshot for visual verification.
