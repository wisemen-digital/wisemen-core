# Design System — Domain Glossary

## Terms

### Appearance
The user- or app-configured theme preference. Type: `'light' | 'dark' | 'system'`.
Exposed via `ThemeProvider` / `useInjectThemeProviderContext().appearance`.
`'system'` means "follow the OS preference" — it is a *setting*, not a rendered mode.

`ThemeProvider` applies `appearance` directly as a CSS class (`light` / `dark` / `system`) on its root element. Resolving `'system'` to an actual light/dark mode happens **in CSS, not JS**: the `.system` class (in `design-token-colors.css`) sets `--theme-mode: light` by default and overrides it to `--theme-mode: dark` inside `@media (prefers-color-scheme: dark)`, mirroring `.light`/`.dark`'s own token values exactly.

Because resolution already happens in CSS, JS code must never compare `appearance.value !== 'dark'` (or similar) to decide how something should look — that misclassifies `'system'` + OS-dark as light. Instead:
- For **CSS-only** visual decisions (backgrounds, colors, hiding an element), use `light:`/`dark:` Tailwind variants — these are custom `@variant`s (`tailwind-config/src/styles/index.css`) that key off the resolved `--theme-mode` custom property via `@container style(...)`, so they correctly see through `'system'`.
- For decisions that must exist as a **JS boolean** (e.g. gating a `v-if`, branching non-CSS logic), do not derive light/dark in JS. Prefer restructuring so CSS carries the light/dark distinction (see `MainLayout.vue`'s `isBranded`, which is now a pure `variant === 'branded'` check with no appearance comparison).

### Branded (variant)
A `MainLayout` `variant` option (`'branded' | 'default'`) that layers brand-colored tokens over the surface, via the `.branded` CSS class. `.branded`'s tokens are only meaningful in light mode — the class carries its own `@container style(--theme-mode: dark)` reset block so that branded content in dark mode renders identically to plain (non-branded) dark mode. This means `.branded` can be applied unconditionally whenever `variant === 'branded'`, with the light/dark distinction handled entirely by CSS, not by gating the class in JS.

### Row interaction (table)
The single mechanism by which an entire `UITable` row becomes actionable as a unit, distinct from actions/interactive elements scoped to one cell. A row has exactly one interaction mode at a time: `getLink` (navigates) or `onRowClick` (invokes a handler with the row's item) — never both on the same table. Implemented as a full-row overlay per cell (see `TableBodyRowCellInteractiveElement` for the opt-out used by nested interactive elements within a cell).
_Avoid_: "row click" alone (ambiguous between the row-interaction mechanism and a raw DOM click event on the row).
