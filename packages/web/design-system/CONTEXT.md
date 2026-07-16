<<<<<<< HEAD
# Design System

Wisemen's Vue component library for web. Provides styled, accessible UI primitives (built on reka-ui) shared across product apps.

## Language

**Today marker**:
The visual cue on a calendar grid cell identifying it as the current date. Rendered as bold day-number text, independent of any dot. Does not compete with the dot slot, so it stays legible regardless of what (if any) custom dot is also present on that date.
_Avoid_: Today dot, current date indicator (ambiguous with the dot-based marker below)

**Day dot**:
A small colored marker in a calendar cell's dot slot, driven by `getDayConfig(date): DayConfig | null`. Two dot kinds can occupy this slot, and only one renders per cell:
- **Custom dot** — caller-supplied via `getDayConfig`, colored per `DotColor` (`blue`, `brand`, `error`, `gray`, `moss`, `pink`, `purple`, `success`, `warning`).
- **Today dot** — brand-colored, shown only when the cell is today AND no custom dot is assigned to that date.

Custom dot takes priority over the today dot when both would apply to the same date; the today marker (bold digit) still renders regardless, so today's identity is never lost.
_Avoid_: Indicator (too generic — always say "today marker" or "day dot")

## Related components

- `DatePickerCalendarGrid.vue` (`ui/date-field/`) — renders the single-date grid; today marker + day dot logic lives here.
- `DateRangeFieldCalendarGrid.vue` (`date-range-field/`) — range grid; mirrors the day-dot logic, should mirror the today-marker fix.
- `DayConfig` / `DotColor` types — `ui/date-field/dateField.type.ts`, `ui/dot/dot.props.ts`.
=======
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
>>>>>>> main
