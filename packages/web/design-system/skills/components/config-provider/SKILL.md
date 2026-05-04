---
name: config-provider
description: >
  Application-level configuration provider that supplies locale, number formatting,
  hour cycle, teleport target, and Google Maps API key to all design system components
  via Vue's provide/inject. Must wrap the entire application.
type: component
library: vue-core-design-system
library_version: "0.8.0"
category: infrastructure
requires: []
exports:
  - UIConfigProvider
  - ConfigProviderProps
  - useInjectConfigContext
---

# UIConfigProvider

Provides global configuration (locale, number formatting, hour cycle, teleport target, Google Maps API key) to all design system components via Vue's provide/inject.

## When to Use

- At the root of every application that uses the design system -- wrap your `App.vue` content in this component
- When you need to change locale, number formatting, or hour cycle settings application-wide

**Use instead:** Nothing -- this component is required for the design system to function correctly.

## Import

```ts
import { UIConfigProvider } from '@wisemen/vue-core-design-system'
import type { ConfigProviderProps } from '@wisemen/vue-core-design-system'
```

## Quick Start

```vue
<script setup lang="ts">
import { UIConfigProvider } from '@wisemen/vue-core-design-system'
</script>

<template>
  <UIConfigProvider locale="en-US">
    <RouterView />
  </UIConfigProvider>
</template>
```

## API

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `locale` | `string` | required | The locale string used for localization across all components (e.g. `'en-US'`, `'nl-BE'`, `'fr-FR'`). |
| `hourCycle` | `'12-hour' \| '24-hour'` | `undefined` | Controls time display in time-related components. When not set, the system locale's default is used. |
| `numberSeparatorStyle` | `'comma-period' \| 'period-comma' \| 'space-comma' \| 'space-period' \| 'system'` | `'system'` | Controls thousands and decimal separator style in NumberField components. See below for examples. |
| `teleportTargetSelector` | `string` | `'body'` | CSS selector for the teleport target used by overlays, popovers, and modals. |
| `googleMapsApiKey` | `string \| null` | `null` | Google Maps API key used by the AddressAutocomplete component for address validation. |

### Number Separator Styles

| Value | Example | Common Locales |
|-------|---------|----------------|
| `'period-comma'` | `1.234.567,89` | de-DE, nl-NL, nl-BE |
| `'comma-period'` | `1,234,567.89` | en-US, en-GB |
| `'space-period'` | `1 234 567.89` | fr-CH |
| `'space-comma'` | `1 234 567,89` | fr-FR |
| `'system'` | Follows browser/OS locale | -- |

### Slots

| Slot | Description |
|------|-------------|
| `default` | Your entire application. All design system components within this slot will receive the configuration. |

### Emits

This component has no events.

## Variants

This component has no visual variants.

## Examples

### Full Configuration

```vue
<script setup lang="ts">
import { UIConfigProvider } from '@wisemen/vue-core-design-system'

const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
</script>

<template>
  <UIConfigProvider
    locale="nl-BE"
    hour-cycle="24-hour"
    number-separator-style="period-comma"
    teleport-target-selector="#app"
    :google-maps-api-key="googleMapsApiKey"
  >
    <RouterView />
  </UIConfigProvider>
</template>
```

### Combined with ThemeProvider

```vue
<script setup lang="ts">
import { UIConfigProvider, UIThemeProvider } from '@wisemen/vue-core-design-system'
</script>

<template>
  <UIConfigProvider locale="en-US">
    <UIThemeProvider appearance="system">
      <RouterView />
    </UIThemeProvider>
  </UIConfigProvider>
</template>
```

### Accessing Config in Custom Components

```vue
<script setup lang="ts">
import { useInjectConfigContext } from '@wisemen/vue-core-design-system'

const config = useInjectConfigContext()

// All properties are ComputedRefs:
// config.locale.value        -> 'en-US'
// config.hourCycle.value      -> '24-hour' | undefined
// config.numberSeparatorStyle.value -> 'system'
// config.teleportTargetSelector.value -> 'body'
// config.googleMapsApiKey.value -> null | 'AIza...'
</script>
```

## Anatomy

```
UIConfigProvider
  TooltipProvider (wraps children with Reka UI tooltip provider)
    <slot /> (application content)
```

## Styling

This component has no visual styling. It is a provider-only wrapper.

## Common Mistakes

### HIGH: Forgetting to wrap the application

Wrong:
```vue
<!-- App.vue -->
<template>
  <RouterView />
</template>
```

Correct:
```vue
<!-- App.vue -->
<template>
  <UIConfigProvider locale="en-US">
    <RouterView />
  </UIConfigProvider>
</template>
```

Without `UIConfigProvider`, components that inject the config context will fail or fall back to undefined values. Always wrap your application root.

### MEDIUM: Placing ThemeProvider outside ConfigProvider

Wrong:
```vue
<UIThemeProvider appearance="system">
  <UIConfigProvider locale="en-US">
    <RouterView />
  </UIConfigProvider>
</UIThemeProvider>
```

Correct:
```vue
<UIConfigProvider locale="en-US">
  <UIThemeProvider appearance="system">
    <RouterView />
  </UIThemeProvider>
</UIConfigProvider>
```

`UIConfigProvider` should be the outermost wrapper since it provides configuration that other providers and components may depend on.

### LOW: Using locale string inconsistently

Wrong:
```vue
<UIConfigProvider locale="en">
```

Correct:
```vue
<UIConfigProvider locale="en-US">
```

Use full BCP-47 locale strings (e.g. `en-US`, `nl-BE`, `fr-FR`) for consistent behavior across components that rely on `Intl` APIs.

## Accessibility

- This component has no direct accessibility impact. It is a configuration wrapper.
- It wraps children in a `TooltipProvider` from Reka UI, which is required for tooltips to function with proper ARIA attributes.
- The `locale` prop indirectly affects accessibility by controlling the language used in component labels and messages.

## See Also

- [UIThemeProvider](../theme-provider/) -- For appearance (light/dark/system) and theme switching
