# Claude Code Guide

## Design System

The primary UI component library is `@wisemen/vue-core-design-system`, located at `packages/web/design-system/src/ui/`.

Components are imported from `@wisemen/vue-core-design-system` and used with the `App` prefix (e.g. `AppButton`, `AppBadge`, `AppAvatar`).

## Figma Design Library

The Figma design library is **Crispy Design Library**:
`https://www.figma.com/design/53EfMqzBSsKnNKps9kfTzK/Crispy-Design-Library`

## Implementing Figma Designs

When implementing a Figma design, always check for a `*.figma.ts` file colocated with the component:
- These files map Figma property names and values to Vue prop names and values
- They are the source of truth for design-to-code prop translation
- Location: `packages/web/design-system/src/ui/**/*.figma.ts`

### Figma property mapping conventions
- Figma `Hierarchy` → Vue `variant` prop
- Figma `State: Disabled` → Vue `:is-disabled="true"`
- Figma `State: Loading` → Vue `:is-loading="true"`
- Figma sizes are one step larger than Vue sizes: `xl`→`lg`, `lg`→`md`, `md`→`sm`

### Connected components

| Figma component | Vue component | Figma node |
|---|---|---|
| Buttons/Button | `AppButton` | [3287:427074](https://www.figma.com/design/53EfMqzBSsKnNKps9kfTzK/Crispy-Design-Library?node-id=3287-427074) |
