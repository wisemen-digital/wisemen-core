# Sections

Each built-in section composable returns a `PreferencesSection` ready to be passed to a view. All composables follow the same `{ get, set }` interface unless they require additional options.

## Appearance

Controls the color scheme of the application.

**Type:** `'light' | 'dark' | 'system'`

```typescript
import { useAppearancePreference } from '@wisemen/vue-core-preferences'

const appearance = useAppearancePreference({
  get: () => store.appearance,
  set: (value) => { 
    store.appearance = value 
  },
})
```

## Display Zoom

Controls the base font size / UI density.

**Type:** `'small' | 'default' | 'large'`

```typescript
import { useDisplayZoomPreference } from '@wisemen/vue-core-preferences'

const displayZoom = useDisplayZoomPreference({
  get: () => store.displayZoom,
  set: (value) => {
    store.displayZoom = value
  },
})
```

Apply the value by changing the document font size:

```typescript
watch(displayZoom, (value) => {
  const multipliers = {
    small: 0.875,
    default: 1,
    large: 1.125
  }
  document.documentElement.style.fontSize = `${multipliers[value] * 16}px`
})
```

## Navigation Arrows

Shows or hides breadcrumb navigation arrows in the UI.

**Type:** `'show' | 'hide'`

```typescript
import { useNavigationArrowsPreference } from '@wisemen/vue-core-preferences'

const navigationArrows = useNavigationArrowsPreference({
  get: () => store.navigationArrows,
  set: (value) => {
    store.navigationArrows = value
  },
})
```

## Toast Auto Close

Controls when toasts are automatically dismissed.

**Type:** `UIToastAutoClose` (from `@wisemen/vue-core-design-system`)

```typescript
import { useToastAutoClosePreference } from '@wisemen/vue-core-preferences'

const toastAutoClose = useToastAutoClosePreference({
  get: () => store.toastAutoClose,
  set: (value) => {
    store.toastAutoClose = value
  },
})
```

## Language

Lets the user pick from the locales your application supports.

**Type:** `string` (a locale string such as `'en-US'`)

Requires `availableLocales` — a `ComputedRef<string[]>` of the locale codes your app has loaded.

```typescript
import { useLanguagePreference } from '@wisemen/vue-core-preferences'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const i18n = useI18n()

const language = useLanguagePreference({
  availableLocales: computed(() => i18n.availableLocales),
  get: () => store.language,
  set: (value) => {
    store.language = value
  },
})
```

## Number Format

Controls how numbers and currencies are formatted.

**Type:** `NumberFormat` (from `@wisemen/vue-core-design-system`)

```typescript
import { useNumberFormatPreference } from '@wisemen/vue-core-preferences'

const numberFormat = useNumberFormatPreference({
  get: () => store.numberFormat,
  set: (value) => {
    store.numberFormat = value
  },
})
```

## Hour Cycle

Switches between 12-hour and 24-hour time display. Pass `null` to follow the locale default.

**Type:** `'12-hour' | '24-hour' | null`

```typescript
import { useHourCyclePreference } from '@wisemen/vue-core-preferences'

const hourCycle = useHourCyclePreference({
  get: () => store.hourCycle,
  set: (value) => {
    store.hourCycle = value
  },
})
```

## Time Zone

Lets the user select a time zone from a list you provide.

**Type:** `string` (an IANA time zone identifier such as `'Europe/Brussels'`)

Requires `availableTimeZones` — a function that returns the list of selectable time zones. Use `TimeZoneUtil` from `@wisemen/vue-core-dates` to get the current zone:

```typescript
import { TimeZoneUtil } from '@wisemen/vue-core-dates'
import { useTimeZonePreference } from '@wisemen/vue-core-preferences'

const timeZone = useTimeZonePreference({
  availableTimeZones: () => [TimeZoneUtil.getCurrentTimeZone()],
  get: () => store.timeZone,
  set: (value) => {
    store.timeZone = value
  },
})
```

Pass a larger list to let users pick any supported time zone:

```typescript
import { TimeZoneUtil } from '@wisemen/vue-core-dates'

const timeZone = useTimeZonePreference({
  availableTimeZones: () => TimeZoneUtil.getAvailableTimeZones(),
  get: () => store.timeZone,
  set: (value) => {
    store.timeZone = value
  },
})
```
