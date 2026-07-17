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

### Badge — variant
A `Badge`'s `variant` prop (`ui/badge/badge.props.ts`) selects its visual weight: `'solid'` (filled background) or `'translucent'` (tinted, low-opacity background). `'outline'` is a deprecated third value — kept in the type and styles for existing consumers, but excluded from Storybook/docs and never to be used in new work. Do not add outline-only styling to future badge work.

### Badge — left config
`Badge`'s `icon?: Component | null`, `dot?: BadgeDotConfig | null`, and `avatar?: BadgeAvatarConfig | null` props are three mutually-intended-exclusive ways to render leading content, mirroring `MenuItemConfig.left`'s icon/dot/avatar/image/breadcrumbs union in `ui/menu-item/menuItem.type.ts`. Going forward, the canonical way to set leading content is the new `left?: BadgeLeftConfig | null` prop (`{ type: 'icon', icon, color? } | { type: 'dot', color? } | { type: 'avatar', name, src? }`). `icon`/`dot`/`avatar` remain as deprecated standalone props for backward compatibility; if both `left` and any of `icon`/`dot`/`avatar` are supplied, `left` wins. The standalone props are candidates for removal in a future major version once consumers migrate.

### Badge — disabled
`isDisabled` on `Badge` is purely presentational (dimmed appearance via `disabled:`-style token overrides), following the `isDisabled: boolean` half of the repo-wide `DisabledWithReason` convention (`types/disabledWithReason.type.ts`) used by `Button` and `MenuItemProps`. Badge is a non-interactive label component, so unlike `Button` it does not need `disabledReason` (no tooltip target) and does not need to alter click/hover behavior.

### Badge — neutral color
`'neutral'` is a `BadgeColor` unlike the other nine (`blue`/`brand`/`error`/`gray`/`moss`/`pink`/`purple`/`success`/`warning`): those are static Tailwind palette shades paired with explicit `dark:` classes per `variant`, whereas `neutral` uses theme-aware semantic tokens (`bg-primary`, `border-secondary`, `text-primary`) that already resolve correctly per theme with no `dark:` variant needed. By design, `neutral` renders identically across `outline`/`solid`/`translucent` — there is no per-variant distinction for this color. `UIDot`'s `DotColor` (`ui/dot/dot.props.ts`) was extended with `neutral` to match, since a neutral badge's dot must resolve to some color.
