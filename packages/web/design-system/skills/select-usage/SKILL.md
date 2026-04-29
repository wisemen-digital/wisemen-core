---
name: select-usage
description: >
  UISelect with displayFn, search modes (local client filtering via
  reka-ui useFilter, remote server filtering with debounced update:search),
  single vs multi-select (keepDropdownOpenOnSelect tri-state), getItemConfig
  for avatar/icon/description rendering, virtual list for large datasets.
  Use when building select/combobox inputs with the design system.
type: core
library: vue-core-design-system
library_version: "0.5.0"
requires:
  - getting-started
sources:
  - "wisemen-digital/wisemen-core:packages/web/design-system/src/ui/select/Select.vue"
  - "wisemen-digital/wisemen-core:packages/web/design-system/src/ui/select/SelectContent.vue"
  - "wisemen-digital/wisemen-core:packages/web/design-system/src/ui/select/SelectDropdown.vue"
  - "wisemen-digital/wisemen-core:packages/web/design-system/src/ui/select/composables/useSelectLocalSearch.ts"
  - "wisemen-digital/wisemen-core:packages/web/design-system/src/ui/select/composables/useSelectRemoteSearch.ts"
---

# @wisemen/vue-core-design-system — Select Usage

## Setup

```vue
<script setup lang="ts">
import { UISelect } from '@wisemen/vue-core-design-system'
import { ref } from 'vue'

interface Country {
  code: string
  name: string
}

const countries: Country[] = [
  { code: 'BE', name: 'Belgium' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'DE', name: 'Germany' },
]

const selected = ref<Country | null>(null)
</script>

<template>
  <UISelect
    v-model="selected"
    label="Country"
    :items="countries"
    :display-fn="(country) => country.name"
    search="local"
    placeholder="Choose a country"
  />
</template>
```

`displayFn` is required — it tells the select how to render any value as a string. It's used for the trigger label, search filtering, and multi-select badges.

## Core Patterns

### Search modes

**No search** (`search` prop omitted or `null`): static dropdown, no filtering.

**Local search** (`search="local"`): client-side filtering using reka-ui's `useFilter` with `sensitivity: 'base'` (case-insensitive, accent-insensitive). Filters items by whether `displayFn(value)` contains the search term.

**Remote search** (`search="remote"`): emits `update:search` with a 100ms debounce. You provide the filtered items:

```vue
<script setup lang="ts">
import { UISelect } from '@wisemen/vue-core-design-system'
import { ref, watch } from 'vue'

const selected = ref<User | null>(null)
const users = ref<User[]>([])
const searchTerm = ref('')

async function handleSearch(term: string) {
  searchTerm.value = term
  users.value = await UserService.search(term)
}
</script>

<template>
  <UISelect
    v-model="selected"
    label="User"
    :items="users"
    :display-fn="(user) => user.name"
    search="remote"
    @update:search="handleSearch"
  />
</template>
```

### Multi-select

Pass an array as `v-model`. Selected items are grouped at the top of the dropdown automatically:

```vue
<script setup lang="ts">
import { UISelect } from '@wisemen/vue-core-design-system'
import { ref } from 'vue'

const selectedTags = ref<Tag[]>([])
</script>

<template>
  <UISelect
    v-model="selectedTags"
    label="Tags"
    :items="allTags"
    :display-fn="(tag) => tag.label"
    search="local"
    is-multiple
  />
</template>
```

When 2+ items are selected, the trigger shows `"N selected"` instead of individual names.

`keepDropdownOpenOnSelect` is a tri-state: `null` (default) auto-closes for single, stays open for multi. Set `true` to always stay open, `false` to always close.

### Rich item rendering with getItemConfig

For items with avatars, icons, descriptions, or status dots:

```vue
<script setup lang="ts">
import { UISelect } from '@wisemen/vue-core-design-system'
import type { MenuItemConfig } from '@wisemen/vue-core-design-system'

function getItemConfig(user: User): MenuItemConfig {
  return {
    avatar: { name: user.name, src: user.avatarUrl },
    description: user.email,
  }
}
</script>

<template>
  <UISelect
    v-model="selectedUser"
    label="Assignee"
    :items="users"
    :display-fn="(user) => user.name"
    :get-item-config="getItemConfig"
    search="local"
  />
</template>
```

`getItemConfig` is called for both the trigger (selected value display) and each dropdown option. It must return a consistent config for the same value in both contexts.

### Virtual list for large datasets

```vue
<UISelect
  v-model="selected"
  label="Product"
  :items="products"
  :display-fn="(p) => p.name"
  :virtual-list="{ isEnabled: true, items: products, optionHeight: 39 }"
  search="local"
/>
```

Only renders visible options in the DOM. Use when the item list exceeds ~100 entries.

## Common Mistakes

### CRITICAL: Omitting displayFn

```vue
<!-- Runtime error — displayFn is required -->
<UISelect v-model="selected" :items="items" label="Pick one" />
```

```vue
<UISelect
  v-model="selected"
  :items="items"
  :display-fn="(item) => item.name"
  label="Pick one"
/>
```

`displayFn` is used to render the selected value in the trigger, to filter items in local search, and to generate badge labels in multi-select. Without it, the component cannot display anything.

Source: `src/ui/select/Select.vue` — `displayFn` is a required prop with no default.

### HIGH: Inconsistent getItemConfig between trigger and dropdown

```typescript
// Returns different configs depending on context — avatar shows in dropdown but not trigger
function getItemConfig(user: User): MenuItemConfig | null {
  if (!user.avatarUrl) return null  // trigger gets null, dropdown gets config
  return { avatar: { name: user.name, src: user.avatarUrl } }
}
```

```typescript
// Always return a consistent config for the same value
function getItemConfig(user: User): MenuItemConfig {
  return {
    avatar: { name: user.name, src: user.avatarUrl ?? undefined },
  }
}
```

`getItemConfig` is called for the same value in two contexts: rendering the trigger (selected value) and rendering each dropdown option. If it returns different results, the trigger and dropdown look inconsistent. For paginated selects where the selected item may not be in the current page, `getItemConfig` is the only way the trigger can render the value — returning `null` leaves it blank.

Source: `src/ui/select/Select.vue` — calls `getItemConfig` in trigger template and passes it to `SelectOption`.

### HIGH: Using remote search without handling empty results

```vue
<!-- items stays empty on mount — select shows nothing until user types -->
<UISelect
  v-model="selected"
  :items="searchResults"
  :display-fn="(u) => u.name"
  search="remote"
  @update:search="handleSearch"
/>
```

```vue
<script setup lang="ts">
const searchResults = ref<User[]>([])

// Load initial items on mount
onMounted(async () => {
  searchResults.value = await UserService.search('')
})

async function handleSearch(term: string) {
  searchResults.value = await UserService.search(term)
}
</script>

<template>
  <UISelect
    v-model="selected"
    :items="searchResults"
    :display-fn="(u) => u.name"
    search="remote"
    @update:search="handleSearch"
  />
</template>
```

With `search="remote"`, you own the item list. If you don't pre-populate it, the dropdown opens empty. Load initial data on mount so users see options before searching.

Source: `src/ui/select/composables/useSelectRemoteSearch.ts` — emits `update:search` but doesn't fetch items itself.

## See Also

- [getting-started](../getting-started/SKILL.md) — UIThemeProvider setup required before using components
- [dialog-usage](../dialog-usage/SKILL.md) — dialogs for confirmation after select-driven actions
