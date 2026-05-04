---
name: select
description: >
  Dropdown select component supporting single and multi-select modes with optional
  search (local or remote), pagination, and rich option rendering via getItemConfig.
  Determines single vs multi mode from the v-model type (value vs array).
type: component
library: vue-core-design-system
category: input
requires:
  - input-system
exports:
  - UISelect
  - UISelectContent
  - UISelectDropdown
  - UISelectOption
  - UISelectProps
  - SelectValue
  - SelectItem
  - SelectOptionItem
  - SelectSeparatorItem
  - SelectOptionConfig
  - SelectOptionAvatarConfig
  - SelectOptionRightConfig
  - createSelectOptions
---

# UISelect

A dropdown select that supports single-select, multi-select, optional search filtering, pagination, and rich option rendering. Single vs multi mode is determined by the v-model type: pass a single value for single-select, pass an array for multi-select.

## When to Use

- When the user must pick one or more values from a predefined list without typing free text
- When options need rich decoration (avatars, icons, dots, descriptions, shortcuts)
- When the list is paginated and requires infinite scroll

**Use instead:** `UIAutocomplete` when the user should type to search (combobox pattern); a `UIRadioGroup` or `UICheckboxGroup` when all options should be visible at once.

## Import

```ts
import { UISelect, createSelectOptions } from '@wisemen/vue-core-design-system'
import type { SelectValue, SelectItem } from '@wisemen/vue-core-design-system'
```

## Quick Start

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { UISelect, createSelectOptions } from '@wisemen/vue-core-design-system'

const items = createSelectOptions(['Apple', 'Banana', 'Cherry', 'Mango'])
const selected = ref<string | null>(null)

function displayFn(value: string): string {
  return value
}
</script>

<template>
  <UISelect
    v-model="selected"
    :display-fn="displayFn"
    :items="items"
    label="Fruit"
    placeholder="Select a fruit..."
    class="w-72"
  />
</template>
```

## API

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `TValue` | required | The selected value (v-model). Pass a single `SelectValue` for single-select, or `SelectValue[]` for multi-select. |
| `displayFn` | `(item: NonNullable<GetValue<TValue>>) => string` | required | Returns the display label for a value. Used in the trigger and in each dropdown option. |
| `items` | `SelectItem<GetValue<TValue>>[]` | required | The items shown in the dropdown. Use `createSelectOptions()` to build this array. |
| `search` | `'local' \| 'remote' \| null` | `null` | `null` disables search; `local` adds a filter input that filters client-side; `remote` adds a filter input that emits `update:search` for server-side filtering. |
| `size` | `'sm' \| 'md'` | `'md'` | Controls trigger height and padding. |
| `getItemConfig` | `((value: NonNullable<GetValue<TValue>>) => MenuItemConfig \| null) \| null` | `null` | Maps a value to visual config (avatar, icon, dot, description, right content). Used both in the trigger display and in each dropdown option. Required for paginated selects where the selected item may not be in the loaded page. |
| `keepDropdownOpenOnSelect` | `boolean \| null` | `null` | `null` auto-closes for single-select and stays open for multi-select. `true` always keeps open; `false` always closes. |
| `limit` | `number \| null` | `null` | When set, and the number of items equals this limit, a "more results available" hint is shown at the bottom of the dropdown. Use for non-paginated but backend-limited lists. |
| `isDisabled` | `boolean` | `false` | Disables the select trigger. |
| `isReadonly` | `boolean` | `false` | Makes the select read-only. |
| `isRequired` | `boolean` | `false` | Marks the field as required (shows asterisk). |
| `isLoading` | `boolean` | `false` | Shows a loading spinner in the trigger and skeleton items in the dropdown when empty. |
| `label` | `string \| null` | `null` | Label displayed above the trigger. |
| `placeholder` | `string \| null` | `null` | Placeholder text shown when no value is selected. |
| `errorMessage` | `string \| null` | `null` | Error message below the trigger. |
| `hideErrorMessage` | `boolean` | `false` | Hides the error message visually while keeping error styling. |
| `hint` | `string \| null` | `null` | Hint text next to the label. |
| `helpText` | `string \| null` | `null` | Help text in a tooltip next to the label. |
| `iconLeft` | `Component \| null` | `null` | Icon on the left side of the trigger. |
| `disabledReason` | `string \| null` | `null` | Tooltip explaining why the field is disabled. |
| `popoverSide` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'bottom'` | Side where the dropdown appears. |
| `popoverAlign` | `'start' \| 'center' \| 'end'` | `'center'` | Alignment of the dropdown. |
| `popoverSideOffset` | `number` | `4` | Pixel offset between trigger and dropdown. |
| `popoverCollisionPadding` | `number` | `8` | Padding from viewport edges. |
| `popoverWidth` | `string` | `'anchor-width'` | Width strategy for the dropdown popover. |

### Slots

| Slot | Description |
|------|-------------|
| `label-left` | Content to the left of the label text. |
| `label-right` | Content to the right of the label text. |
| `left` | Content inside the field wrapper, to the left of the value display. |
| `right` | Content inside the field wrapper, to the right of the value display. |
| `value` | Override the selected value display in the trigger. Receives no props. Shown only when a value is selected. |

### Emits

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `TValue` | Fired when the selected value changes. |
| `update:search` | `string` | Fired when the debounced search term changes (remote mode only). Emits `''` on dropdown close. |
| `blur` | none | Fired when the dropdown closes. |
| `nextPage` | none | Fired when the user scrolls near the bottom of the dropdown (for pagination / infinite scroll). |

## Variants

### Size

- `md` (default) -- Standard trigger height with `px-md` padding.
- `sm` -- Compact trigger height with `px-sm` padding.

## Key Concepts

### SelectValue Type

```ts
type SelectValue = number | string | Record<string, any> | null
```

Values can be primitives (string, number) or complex objects. The generic `TValue` is inferred from `v-model`: pass `string | null` for single-select with strings, pass `User | null` for single-select with objects, pass `string[]` for multi-select with strings.

### createSelectOptions Utility

Wraps a plain array of values into the required `SelectItem` format:

```ts
function createSelectOptions<TValue extends NonNullable<SelectValue>>(
  options: TValue[],
): SelectItem<TValue>[]

// Usage:
const items = createSelectOptions(['Apple', 'Banana', 'Cherry'])
// Result: [{ type: 'option', value: 'Apple' }, { type: 'option', value: 'Banana' }, ...]
```

You can also build items manually to include separators:

```ts
const items: SelectItem<string>[] = [
  { type: 'option', value: 'Apple' },
  { type: 'option', value: 'Banana' },
  { type: 'separator' },
  { type: 'option', value: 'Cherry' },
]
```

### Single vs Multi-Select

The mode is determined entirely by the `v-model` type:

```ts
// Single-select: pass a single value or null
const selected = ref<string | null>(null)

// Multi-select: pass an array
const selected = ref<string[]>([])
```

In multi-select mode:
- Selected items are shown as truncatable badges in the trigger
- Selected items are grouped at the top of the dropdown, separated from unselected items
- The dropdown stays open after each selection (toggle behavior)

### getItemConfig for Rich Options

The `getItemConfig` function maps each value to a `MenuItemConfig`:

```ts
interface MenuItemConfig {
  avatar?: { name: string; src?: string | null; imageAlt?: string | null } | null
  description?: string | null
  descriptionLayout?: 'block' | 'inline'
  dot?: { color?: DotColor } | null
  icon?: Component | null
  label?: string | null
  right?: MenuItemRightConfig | null
}
```

This config is used both in the trigger (to display the selected value with its avatar/icon/dot) and in each dropdown option.

## Examples

### Single Select with Strings

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { UISelect, createSelectOptions } from '@wisemen/vue-core-design-system'

const items = createSelectOptions([
  'Apple', 'Banana', 'Cherry', 'Mango', 'Orange', 'Strawberry',
])
const selected = ref<string | null>(null)

function displayFn(value: string): string {
  return value
}
</script>

<template>
  <UISelect
    v-model="selected"
    :display-fn="displayFn"
    :items="items"
    label="Fruit"
    placeholder="Select a fruit..."
    class="w-72"
  />
</template>
```

### Multi-Select with Strings

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { UISelect, createSelectOptions } from '@wisemen/vue-core-design-system'

const items = createSelectOptions([
  'Apple', 'Banana', 'Cherry', 'Mango', 'Orange', 'Strawberry',
])
const selected = ref<string[]>([])

function displayFn(value: string): string {
  return value
}
</script>

<template>
  <UISelect
    v-model="selected"
    :display-fn="displayFn"
    :items="items"
    label="Fruits"
    placeholder="Select fruits..."
    class="w-72"
  />
</template>
```

### Single Select with Complex Objects and Item Config

```vue
<script setup lang="ts">
import { Building01Icon } from '@wisemen/vue-core-icons'
import { ref } from 'vue'
import { UISelect, createSelectOptions } from '@wisemen/vue-core-design-system'
import type { MenuItemConfig } from '@wisemen/vue-core-design-system'

interface User {
  id: number
  name: string
  email: string
  avatarSrc?: string
}

const users: User[] = [
  { id: 1, name: 'Alice Johnson', avatarSrc: 'https://i.pravatar.cc/150?u=alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob Smith', avatarSrc: 'https://i.pravatar.cc/150?u=bob', email: 'bob@example.com' },
  { id: 3, name: 'Carol White', email: 'carol@example.com' },
]

const items = createSelectOptions(users)
const selected = ref<User | null>(null)

function displayFn(user: User): string {
  return user.name
}

function getItemConfig(user: User): MenuItemConfig {
  return {
    description: user.email,
    descriptionLayout: 'block',
    dot: { color: 'pink' },
    label: user.name,
    right: { icon: Building01Icon, text: 'Wisemen', type: 'icon-text' },
  }
}
</script>

<template>
  <UISelect
    v-model="selected"
    :display-fn="displayFn"
    :items="items"
    :get-item-config="getItemConfig"
    label="User"
    placeholder="Select a user..."
    class="w-150"
  />
</template>
```

### With Local Search

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { UISelect, createSelectOptions } from '@wisemen/vue-core-design-system'

const items = createSelectOptions([
  'Apple', 'Banana', 'Cherry', 'Mango', 'Orange', 'Strawberry',
])
const selected = ref<string | null>(null)

function displayFn(value: string): string {
  return value
}
</script>

<template>
  <UISelect
    v-model="selected"
    :display-fn="displayFn"
    :items="items"
    search="local"
    label="Fruit"
    placeholder="Select a fruit..."
    class="w-72"
  />
</template>
```

### With Remote Search and Pagination

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { UISelect, createSelectOptions } from '@wisemen/vue-core-design-system'
import type { SelectItem } from '@wisemen/vue-core-design-system'

interface Product {
  id: string
  name: string
}

const items = ref<SelectItem<Product>[]>([])
const selected = ref<Product | null>(null)
const isLoading = ref(false)
let currentPage = 1

function displayFn(product: Product): string {
  return product.name
}

async function onSearch(search: string): Promise<void> {
  isLoading.value = true
  currentPage = 1
  try {
    const response = await fetchProducts({ search, page: 1 })
    items.value = createSelectOptions(response.data)
  } finally {
    isLoading.value = false
  }
}

async function onNextPage(): Promise<void> {
  currentPage++
  const response = await fetchProducts({ page: currentPage })
  items.value = [...items.value, ...createSelectOptions(response.data)]
}
</script>

<template>
  <UISelect
    v-model="selected"
    :display-fn="displayFn"
    :items="items"
    :is-loading="isLoading"
    search="remote"
    label="Product"
    placeholder="Search products..."
    class="w-72"
    @update:search="onSearch"
    @next-page="onNextPage"
  />
</template>
```

### Multi-Select with Item Config (Avatars)

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { UISelect, createSelectOptions } from '@wisemen/vue-core-design-system'
import type { MenuItemConfig } from '@wisemen/vue-core-design-system'

interface User {
  id: number
  name: string
  email: string
  avatarSrc?: string
}

const users: User[] = [
  { id: 1, name: 'Alice Johnson', avatarSrc: 'https://i.pravatar.cc/150?u=alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob Smith', avatarSrc: 'https://i.pravatar.cc/150?u=bob', email: 'bob@example.com' },
  { id: 3, name: 'Carol White', email: 'carol@example.com' },
]

const items = createSelectOptions(users)
const selected = ref<User[]>([])

function displayFn(user: User): string {
  return user.name
}

function getItemConfig(user: User): MenuItemConfig {
  return {
    avatar: { name: user.name, src: user.avatarSrc ?? null },
    description: user.email,
    descriptionLayout: 'block',
  }
}
</script>

<template>
  <UISelect
    v-model="selected"
    :display-fn="displayFn"
    :items="items"
    :get-item-config="getItemConfig"
    label="Users"
    placeholder="Select users..."
    class="w-150"
  />
</template>
```

## Anatomy

```
UISelect
  InputWrapper (label, hint, error)
    FieldWrapper (iconLeft, ChevronDownIcon, loading)
      RowLayout (value display area)
        BadgeGroupTruncate (multi-select: badges for each selected value)
        RowLayout (single-select: avatar/icon/dot + label text)
        UIText (placeholder, when nothing selected)
      SelectDropdown
        Popover
          slot#trigger (invisible combobox button)
          slot#content
            SelectContent
              RekaListboxRoot
                RekaListboxFilter (search input, when search != null)
                Scrollable (scroll + infinite-scroll)
                  SelectOption (per item)
                    RekaListboxItem
                      UIMenuItem (avatar/icon/dot + label + check indicator)
                  UISeparator (for separator items / selected-group divider)
                  SelectLoading (skeleton, shown when loading + empty)
                  "No results found" text
                  "More results available" text (when items.length === limit)
```

## Styling

This component uses inline Tailwind classes (no separate style file).

**Trigger:** Inherits `FieldWrapper` styling. The chevron-down icon is always shown on the right. Multi-select badges use `BadgeGroupTruncate` with `size="sm"`, `color="gray"`, `variant="translucent"`.

**Dropdown:** `rounded-md border border-secondary bg-primary shadow-lg`. The search input has `h-7 rounded-sm bg-secondary px-md text-xs`. Max height clamped to `min(--reka-popover-content-available-height, 32rem)`.

**Options:** Keyboard-highlighted items get `bg-secondary-hover`. Selected items show a `CheckIcon` indicator.

## Common Mistakes

### HIGH: Passing a single value for multi-select or vice versa

Wrong:
```vue
<!-- This creates a multi-select but you probably wanted single -->
<script setup>
const selected = ref<string[]>([])
</script>
<UISelect v-model="selected" ... />
<!-- The dropdown stays open, badges appear, etc. -->
```

The select mode is inferred from the v-model type. Use `ref<string | null>(null)` for single-select and `ref<string[]>([])` for multi-select.

### HIGH: Not providing getItemConfig for paginated selects

Wrong:
```vue
<UISelect
  v-model="selected"
  :items="pagedItems"
  :display-fn="displayFn"
  search="remote"
  @update:search="fetchPage"
/>
```

Correct:
```vue
<UISelect
  v-model="selected"
  :items="pagedItems"
  :display-fn="displayFn"
  :get-item-config="getItemConfig"
  search="remote"
  @update:search="fetchPage"
/>
```

When using pagination, the selected item may not be in the currently loaded page. Without `getItemConfig`, the trigger cannot display the avatar/icon/dot for the selected value because it only has `displayFn`. Always provide `getItemConfig` for paginated selects.

### MEDIUM: Not wrapping items with createSelectOptions

Wrong:
```vue
<UISelect :items="['Apple', 'Banana']" />
```

Correct:
```vue
<UISelect :items="createSelectOptions(['Apple', 'Banana'])" />
```

Items must be `SelectItem<TValue>[]` with a `type: 'option'` discriminator. Use `createSelectOptions()` to wrap plain values.

### MEDIUM: Using search="local" with remote data

When items come from an API, use `search="remote"` so the search term is emitted for server-side filtering. With `search="local"`, filtering happens client-side on the currently loaded items only.

### LOW: Forgetting update:search emits empty string on close

When `search="remote"`, the component emits `update:search` with `''` when the dropdown unmounts. Your search handler should handle this gracefully (e.g., reset to the initial page of results or no-op).

## Accessibility

- The trigger is a `<button>` with `role="combobox"`, `aria-expanded`, `aria-controls`, `aria-required`, `aria-invalid`, and `aria-busy` attributes.
- The dropdown uses Reka UI's `ListboxRoot` with proper `role="listbox"` semantics.
- Keyboard: Arrow Up/Down opens the dropdown and navigates options. Enter selects. Escape closes. Typing characters opens the dropdown.
- Selected options show a check icon indicator via `RekaListboxItemIndicator`.
- In multi-select, `selection-behavior="toggle"` allows toggling items on/off.
- Error and hint messages are linked via `aria-describedby`.
- A screen-reader-only `<span>` in the trigger announces the current value label.

## See Also

- [UIAutocomplete](../autocomplete/) -- For typeahead search where the user types to filter
- [input-system](../../foundations/input-system/) -- Shared input infrastructure (InputWrapper, FieldWrapper, error/label/hint)
