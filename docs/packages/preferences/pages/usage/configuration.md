# Configuration

The preferences dialog is built from a **config object** that describes your views, sections, and how each preference is read and written. This page walks through the full setup.

## Overview

The setup has three layers:

1. **Sections** — each preference setting (appearance, language, …) is a section with a `get` / `set` accessor
2. **Views** — groups of related sections shown as a single page (e.g. "General", "Language & Region")
3. **Config** — one or more categories that hold your views, plus optional metadata like the app version

## 1. Create a preferences store

Sections read and write values through a `get` / `set` pair you provide. Start by defining the shape and defaults:

```typescript
// preferences.model.ts
import type { TimeZone } from '@wisemen/vue-core-dates'
import type { NumberFormat, UIToastAutoClose } from '@wisemen/vue-core-design-system'
import type { NavigationArrowsPreference } from '@wisemen/vue-core-preferences'

export type AppearancePreference = 'dark' | 'light' | 'system'
export type DisplayZoomPreference = 'default' | 'large' | 'small'
export type HourCyclePreference = '12-hour' | '24-hour'

export interface Preferences {
  appearance: AppearancePreference
  displayZoom: DisplayZoomPreference
  hourCycle: HourCyclePreference | null
  language: string
  navigationArrows: NavigationArrowsPreference
  numberFormat: NumberFormat
  timeZone: TimeZone
  toastAutoClose: UIToastAutoClose
}
```

```typescript
// defaultPreferences.const.ts
import { TimeZoneUtil } from '@wisemen/vue-core-dates'
import type { Preferences } from './preferences.model'

export const DEFAULT_PREFERENCES: Preferences = {
  appearance: 'system',
  displayZoom: 'default',
  hourCycle: null,
  language: 'en-US',
  navigationArrows: 'show',
  numberFormat: 'system',
  timeZone: TimeZoneUtil.getCurrentTimeZone(),
  toastAutoClose: 'always',
}
```

Then create a Pinia store that persists values in `localStorage` via `useLocalStorage` from `@vueuse/core`. If your app syncs preferences to an API, debounce the call inside `setPreference` and add a `loadAccountPreferences` method to hydrate from the server on startup:

```typescript
// preferences.store.ts
import { useDebounceFn, useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'

import { DEFAULT_PREFERENCES } from './defaultPreferences.const'
import type { Preferences } from './preferences.model'

export const usePreferencesStore = defineStore('preferences', () => {
  const preferences = useLocalStorage<Preferences>('preferences', DEFAULT_PREFERENCES)

  async function loadAccountPreferences(): Promise<void> {
    const result = await AccountPreferencesService.get()

    if (result.isErr()) {
      preferences.value = { ...DEFAULT_PREFERENCES, ...preferences.value }
      return
    }

    // Server values take priority, but local values fill in any gaps
    preferences.value = { ...DEFAULT_PREFERENCES, ...preferences.value, ...result.value }
  }

  const syncToApi = useDebounceFn(async () => {
    await AccountPreferencesService.update(preferences.value)
  }, 1000)

  function setPreference<K extends keyof Preferences>(key: K, value: Preferences[K]): void {
    preferences.value[key] = value
    syncToApi()
  }

  function getPreference<K extends keyof Preferences>(key: K): Preferences[K] {
    return preferences.value[key]
  }

  return {
    getPreference,
    loadAccountPreferences,
    setPreference,
  }
})
```

## 2. Create sections

Import a section composable for each preference and wire it to your store:

```typescript
import { TimeZoneUtil } from '@wisemen/vue-core-dates'
import {
  useAppearancePreference,
  useDisplayZoomPreference,
  useHourCyclePreference,
  useLanguagePreference,
  useNavigationArrowsPreference,
  useNumberFormatPreference,
  useTimeZonePreference,
  useToastAutoClosePreference,
} from '@wisemen/vue-core-preferences'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { usePreferencesStore } from './preferences.store'

export function usePreferences() {
  const i18n = useI18n()
  const store = usePreferencesStore()

  const appearance = useAppearancePreference({
    get: () => store.getPreference('appearance'),
    set: (value) => store.setPreference('appearance', value),
  })

  const language = useLanguagePreference({
    availableLocales: computed(() => i18n.availableLocales),
    get: () => store.getPreference('language'),
    set: (value) => store.setPreference('language', value),
  })

  const timeZone = useTimeZonePreference({
    availableTimeZones: () => [TimeZoneUtil.getCurrentTimeZone()],
    get: () => store.getPreference('timeZone'),
    set: (value) => store.setPreference('timeZone', value),
  })

  // … other sections

  return { appearance, language, timeZone }
}
```

See [Sections](./sections) for the full list of available section composables and their options.

## 3. Create views

Wrap sections into views using the built-in view composables:

```typescript
import {
  usePreferencesGeneralView,
  usePreferencesLanguageAndRegionView,
} from '@wisemen/vue-core-preferences'

const { appearance, displayZoom, navigationArrows, toastAutoClose, language, numberFormat, hourCycle, timeZone } = usePreferences()

const generalView = usePreferencesGeneralView([
  appearance,
  displayZoom,
  navigationArrows,
  toastAutoClose,
])

const languageView = usePreferencesLanguageAndRegionView([
  language,
  numberFormat,
  hourCycle,
  timeZone,
])
```

You can also create a custom view by passing an object that satisfies `PreferencesView`:

```typescript
import type { PreferencesView } from '@wisemen/vue-core-preferences'
import { SomeCustomIcon } from '@wisemen/vue-core-icons'
import { computed, markRaw } from 'vue'
import { useI18n } from 'vue-i18n'

function useMyCustomView(sections: PreferencesSection[]): PreferencesView {
  const i18n = useI18n()

  return {
    id: 'my-custom-view',
    title: computed(() => i18n.t('preferences.views.custom.name')),
    icon: markRaw(SomeCustomIcon),
    sections,
  }
}
```

## 4. Create the dialog

Call `useCreatePreferencesDialog` with your config to get a type-safe dialog instance:

```typescript
import {
  useCreatePreferencesDialog,
  usePreferencesGeneralView,
  usePreferencesLanguageAndRegionView,
} from '@wisemen/vue-core-preferences'

import { usePreferences } from './preferences.composable'

export function usePreferencesDialog() {
  const { appearance, displayZoom, navigationArrows, toastAutoClose, language, numberFormat, hourCycle, timeZone } = usePreferences()

  return useCreatePreferencesDialog({
    activeView: 'general',
    config: {
      appVersion: '1.0.0',
      categories: [
        {
          views: [
            usePreferencesGeneralView([
              appearance, 
              displayZoom, 
              navigationArrows, 
              toastAutoClose
            ]),
            usePreferencesLanguageAndRegionView([
              language, 
              numberFormat, 
              hourCycle,
              timeZone
            ]),
          ],
        },
      ],
    },
  })
}
```

## 5. Open the dialog

The returned object has an `open` method. It accepts an optional view ID and an optional section ID, both fully type-checked against your config:

```typescript
const dialog = usePreferencesDialog()

// Open to the default view
dialog.open()

// Open to a specific view
dialog.open('language-and-region')

// Show a specific section
dialog.open('general', 'appearance')
```

## Config reference

```typescript
interface PreferencesConfig {
  appVersion?: string           // Shown in the dialog footer
  categories: PreferencesCategory[]
}

interface PreferencesCategory {
  title?: string | ComputedRef<string>  // Optional group heading in the sidebar
  views: PreferencesView[]
}

interface PreferencesView {
  id: string
  title: string | ComputedRef<string>
  description?: string | ComputedRef<string>
  icon: Raw<Component>
  sections: PreferencesSection[]
}

interface PreferencesSection {
  id: string
  title: string | ComputedRef<string>
  description: string | ComputedRef<string>
  tags: string[] | ComputedRef<string[]>
  component: () => Component
}
```
