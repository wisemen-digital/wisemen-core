---
name: autocomplete
description: >
  Typeahead input that filters a dropdown list as the user types. Supports local
  client-side filtering and remote server-side search with debouncing. Uses the
  input-system foundation for labels, errors, and field wrappers.
type: component
library: vue-core-design-system
category: input
requires:
  - input-system
exports:
  - UIAutocomplete
  - UIAutocompleteContent
  - UIAutocompleteOption
  - UIAutocompleteProps
  - AutocompleteValue
  - AutocompleteItem
  - AutocompleteOptionItem
  - AutocompleteSeparatorItem
  - createAutocompleteOptions
---

# UIAutocomplete

A combobox-style input that opens a filterable dropdown as the user types, powered by Reka UI's ComboboxRoot.

## When to Use

- When the user must select a single value from a large list by typing to narrow results
- When search results come from a remote API and need debounced fetching
- When you need avatar/icon/status decoration on each option via `getItemConfig`

**Use instead:** `UISelect` when the user should pick from a fixed list without typing; a plain `UITextField` when free-form text is acceptable.

## Import

```ts
import { UIAutocomplete, createAutocompleteOptions } from '@wisemen/vue-core-design-system'
```

## Quick Start

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { UIAutocomplete, createAutocompleteOptions } from '@wisemen/vue-core-design-system'

const items = createAutocompleteOptions(['Apple', 'Banana', 'Cherry', 'Mango'])
const selected = ref<string | null>(null)

function displayFn(value: string): string {
  return value
}
</script>

<template>
  <UIAutocomplete
    v-model="selected"
    :display-fn="displayFn"
    :items="items"
    label="Fruit"
    placeholder="Search a fruit..."
    class="w-72"
  />
</template>
```

## API

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `TValue \| null` | required | The selected value (v-model). |
| `displayFn` | `(item: NonNullable<TValue>) => string` | required | Returns the display label for a value. Used in the input and dropdown. |
| `items` | `AutocompleteItem<TValue>[]` | required | The items to show in the dropdown. Use `createAutocompleteOptions()` to build this array. |
| `searchMode` | `'local' \| 'remote'` | `'remote'` | `local` filters client-side using case-insensitive `contains`; `remote` emits `update:search` for server-side filtering. |
| `size` | `'sm' \| 'md'` | `'md'` | Controls input height and padding. |
| `getItemConfig` | `((value: NonNullable<TValue>) => MenuItemConfig \| null) \| null` | `null` | Maps a value to visual config (avatar, icon, dot, description, right content) for each dropdown option. |
| `isDisabled` | `boolean` | `false` | Disables the input. |
| `isReadonly` | `boolean` | `false` | Makes the input read-only. |
| `isRequired` | `boolean` | `false` | Marks the input as required (shows asterisk on label). |
| `isLoading` | `boolean` | `false` | Shows a loading spinner in the field wrapper and skeleton items in the dropdown when there are no results. |
| `label` | `string \| null` | `null` | The label displayed above the input. |
| `placeholder` | `string \| null` | `null` | Placeholder text shown when no value is selected. |
| `errorMessage` | `string \| null` | `null` | Error message displayed below the input. |
| `hideErrorMessage` | `boolean` | `false` | Hides the error message visually while keeping the error styling. |
| `hint` | `string \| null` | `null` | Hint text shown next to the label. |
| `helpText` | `string \| null` | `null` | Help text shown in a tooltip next to the label. |
| `iconLeft` | `Component \| null` | `null` | Icon displayed on the left side of the input. |
| `iconRight` | `Component \| null` | `ChevronDownIcon` | Icon displayed on the right side of the input. |
| `autocomplete` | `string` | `'off'` | The HTML autocomplete attribute. |
| `name` | `string \| null` | `null` | The name attribute for the input. |
| `disabledReason` | `string \| null` | `null` | Tooltip text explaining why the input is disabled. |
| `popoverSide` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'bottom'` | Side where the dropdown appears. |
| `popoverAlign` | `'start' \| 'center' \| 'end'` | `'center'` | Alignment of the dropdown relative to the input. |
| `popoverSideOffset` | `number` | `4` | Pixel offset between the input and dropdown. |
| `popoverCollisionPadding` | `number` | `8` | Padding from viewport edges for collision detection. |

### Slots

| Slot | Description |
|------|-------------|
| `default` | Not used directly. |
| `label-left` | Content rendered to the left of the label text. |
| `label-right` | Content rendered to the right of the label text. |
| `left` | Content rendered inside the field wrapper, to the left of the input. |
| `right` | Content rendered inside the field wrapper, to the right of the input (before the icon). |

### Emits

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `TValue \| null` | Fired when the selected value changes. |
| `update:search` | `string` | Fired when the debounced search term changes (remote mode only). |
| `blur` | none | Fired when the dropdown closes. |
| `nextPage` | none | Fired when the user scrolls near the bottom of the dropdown (for infinite scroll / pagination). |

## Variants

### Size

- `md` (default) -- Standard input height with `px-md` padding.
- `sm` -- Compact input height with `px-sm` padding.

## Examples

### Local Search (String Values)

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { UIAutocomplete, createAutocompleteOptions } from '@wisemen/vue-core-design-system'

const items = createAutocompleteOptions([
  'Apple', 'Banana', 'Cherry', 'Mango', 'Orange', 'Strawberry',
])
const selected = ref<string | null>(null)

function displayFn(value: string): string {
  return value
}
</script>

<template>
  <UIAutocomplete
    v-model="selected"
    :display-fn="displayFn"
    :items="items"
    search-mode="local"
    label="Fruit"
    placeholder="Search a fruit..."
    class="w-72"
  />
</template>
```

### Remote Search (Complex Objects)

```vue
<script setup lang="ts">
import { ref, watch } from 'vue'
import { UIAutocomplete, createAutocompleteOptions } from '@wisemen/vue-core-design-system'
import type { AutocompleteItem } from '@wisemen/vue-core-design-system'

interface User {
  id: string
  name: string
}

const selected = ref<User | null>(null)
const items = ref<AutocompleteItem<User>[]>([])
const isLoading = ref(false)

function displayFn(user: User): string {
  return user.name
}

async function onSearch(search: string): Promise<void> {
  isLoading.value = true
  try {
    const response = await fetchUsers({ search })
    items.value = createAutocompleteOptions(response.data)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <UIAutocomplete
    v-model="selected"
    :display-fn="displayFn"
    :items="items"
    :is-loading="isLoading"
    search-mode="remote"
    label="User"
    placeholder="Search users..."
    class="w-72"
    @update:search="onSearch"
  />
</template>
```

### With Item Config (Avatar and Description)

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { UIAutocomplete, createAutocompleteOptions } from '@wisemen/vue-core-design-system'
import type { MenuItemConfig } from '@wisemen/vue-core-design-system'

interface User {
  id: string
  name: string
  email: string
  avatarSrc?: string
}

const users: User[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', avatarSrc: 'https://i.pravatar.cc/150?u=alice' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com' },
]

const items = createAutocompleteOptions(users)
const selected = ref<User | null>(null)

function displayFn(user: User): string {
  return user.name
}

function getItemConfig(user: User): MenuItemConfig {
  return {
    avatar: { name: user.name, src: user.avatarSrc ?? null },
    description: user.email,
  }
}
</script>

<template>
  <UIAutocomplete
    v-model="selected"
    :display-fn="displayFn"
    :items="items"
    :get-item-config="getItemConfig"
    search-mode="local"
    label="User"
    placeholder="Search users..."
    class="w-72"
  />
</template>
```

## Anatomy

```
UIAutocomplete
  InputWrapper (label, hint, error)
    RekaComboboxRoot
      RekaComboboxAnchor
        FieldWrapper (iconLeft, iconRight, loading)
          RekaComboboxInput (the text input)
      AutocompleteContent (portal)
        ThemeProvider
          RekaComboboxContent (positioned popover)
            Scrollable (scroll + infinite-scroll)
              AutocompleteOption (per item)
                RekaComboboxItem
                  UIMenuItem (avatar/icon/dot + label + check indicator)
              UISeparator (for separator items)
              AutocompleteLoading (skeleton, shown when loading + empty)
              "No results found" text (shown when not loading + empty)
```

## Styling

**Style file:** `autocomplete.style.ts` -- uses Tailwind Variants (`tv`).

| Slot | Classes |
|------|---------|
| `input` | `size-full truncate bg-transparent text-xs text-primary outline-none` + placeholder/readonly/disabled styles |

**Size variants:**
- `md`: `px-md`
- `sm`: `px-sm`

The dropdown uses inline Tailwind classes: `rounded-md border border-secondary bg-primary shadow-lg`, max height clamped to `min(--reka-combobox-content-available-height, 32rem)`.

## Common Mistakes

### HIGH: Using local mode with remote data

Wrong:
```vue
<UIAutocomplete
  :items="remoteItems"
  search-mode="local"
  @update:search="fetchFromApi"
/>
```

Correct:
```vue
<UIAutocomplete
  :items="remoteItems"
  search-mode="remote"
  @update:search="fetchFromApi"
/>
```

When `searchMode` is `local`, the component filters items client-side and ignores `update:search`. Use `remote` when items come from an API so the search term is emitted and you control the filtering.

### MEDIUM: Forgetting displayFn for complex objects

Wrong:
```vue
<!-- This will show "[object Object]" in the input -->
<UIAutocomplete
  v-model="selected"
  :display-fn="(v) => v"
  :items="userItems"
/>
```

Correct:
```vue
<UIAutocomplete
  v-model="selected"
  :display-fn="(user) => user.name"
  :items="userItems"
/>
```

`displayFn` must return a string. For objects, extract the human-readable property.

### MEDIUM: Not wrapping items with createAutocompleteOptions

Wrong:
```vue
<UIAutocomplete :items="['Apple', 'Banana']" />
```

Correct:
```vue
<UIAutocomplete :items="createAutocompleteOptions(['Apple', 'Banana'])" />
```

Items must be `AutocompleteItem<TValue>[]` with a `type: 'option'` discriminator. Use `createAutocompleteOptions()` to wrap plain values.

## Accessibility

- Built on Reka UI's `ComboboxRoot`, which implements the WAI-ARIA Combobox pattern.
- The input has `role="combobox"` with `aria-expanded`, `aria-required`, `aria-invalid`, `aria-busy`, and `aria-describedby` attributes.
- Keyboard navigation: Arrow keys highlight options, Enter selects, Escape closes.
- Selected option shows a check icon indicator.
- When disabled, the input is not focusable (`disabled` attribute).
- Error and hint messages are linked via `aria-describedby`.

## See Also

- [UISelect](../select/) -- For dropdown selection without free-text typing
- [input-system](../../foundations/input-system/) -- Shared input infrastructure (InputWrapper, FieldWrapper, error/label/hint)
