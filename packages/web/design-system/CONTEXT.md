# Design System — Domain Glossary

## Terms

### Appearance
The user- or app-configured theme preference. Type: `'light' | 'dark' | 'system'`.
Exposed via `ThemeProvider` / `useInjectThemeProviderContext().appearance`.
`'system'` means "follow the OS preference" — it is a *setting*, not a rendered state, and must never be compared directly against `'light'` or `'dark'` to decide how something should look.

### Resolved Appearance
The actual light/dark mode used for rendering decisions. Type: `'light' | 'dark'` (never `'system'`).
Derived from [[Appearance]]:
- If `appearance` is `'light'` or `'dark'`, `resolvedAppearance` equals it directly (explicit setting always wins).
- If `appearance` is `'system'`, `resolvedAppearance` falls back to the OS-reported color scheme (e.g. via `usePreferredColorScheme` from `@vueuse/core`).

Any component that branches its visuals on light vs. dark (e.g. `MainLayout`'s `isBrandedActive`) must use **Resolved Appearance**, never **Appearance**, otherwise `'system'` + OS dark mode is misclassified as light.
