<script setup lang="ts">
import {
  DropdownMenuFilter as RekaDropdownMenuFilter,
  DropdownMenuGroup as RekaDropdownMenuGroup,
  DropdownMenuLabel as RekaDropdownMenuLabel,
  DropdownMenuRadioGroup as RekaDropdownMenuRadioGroup,
} from 'reka-ui'
import {
  computed,
  ref,
} from 'vue'

import DropdownMenuCheckboxItemVue from '@/ui/dropdown-menu/DropdownMenuCheckboxItem.vue'
import type { DropdownMenuItem } from '@/ui/dropdown-menu/dropdownMenuItem.type'
import DropdownMenuItemVue from '@/ui/dropdown-menu/DropdownMenuItem.vue'
import DropdownMenuRadioOptionItemVue from '@/ui/dropdown-menu/DropdownMenuRadioOptionItem.vue'
import DropdownMenuSeparator from '@/ui/dropdown-menu/DropdownMenuSeparator.vue'
import DropdownMenuSubMenuItemVue from '@/ui/dropdown-menu/DropdownMenuSubMenuItem.vue'

const props = defineProps<{
  filter?: boolean
  items: DropdownMenuItem[]
}>()

const searchQuery = ref<string>('')

const filteredItems = computed<DropdownMenuItem[]>(() => {
  if (!props.filter || searchQuery.value === '') {
    return props.items
  }

  const query = searchQuery.value.toLowerCase()

  return props.items.reduce<DropdownMenuItem[]>((acc, item) => {
    if (item.type === 'separator') {
      return acc
    }

    if (item.type === 'radio-group') {
      acc.push(item)

      return acc
    }

    if (item.type === 'group') {
      const filteredGroupItems = item.items.filter(
        (child) => 'label' in child && child.label.toLowerCase().includes(query),
      )

      if (filteredGroupItems.length > 0) {
        acc.push({
          ...item,
          items: filteredGroupItems,
        })
      }

      return acc
    }

    if (item.label.toLowerCase().includes(query)) {
      acc.push(item)
    }

    return acc
  }, [])
})
</script>

<template>
  <div
    v-if="props.filter"
    class="p-xs pb-none"
  >
    <RekaDropdownMenuFilter
      v-model="searchQuery"
      placeholder="Search..."
      class="
        h-7 w-full rounded-sm bg-secondary px-md text-xs text-primary
        outline-none
        placeholder:text-placeholder
      "
      auto-focus
    />
  </div>

  <template
    v-for="(item, index) in filteredItems"
    :key="index"
  >
    <DropdownMenuItemVue
      v-if="item.type === 'item'"
      :label="item.label"
      :config="item"
      :disabled-reason="item.disabledReason ?? null"
      @select="item.onSelect"
    />

    <DropdownMenuSeparator v-else-if="item.type === 'separator'" />

    <DropdownMenuSubMenuItemVue
      v-else-if="item.type === 'submenu'"
      :item="item"
    />

    <DropdownMenuCheckboxItemVue
      v-else-if="item.type === 'checkbox'"
      :item="item"
    />

    <RekaDropdownMenuRadioGroup
      v-else-if="item.type === 'radio-group'"
      :model-value="item.value"
      @update:model-value="(v) => v != null && item.onChange(v as string)"
    >
      <DropdownMenuRadioOptionItemVue
        v-for="option in item.items"
        :key="option.value"
        :option="option"
      />
    </RekaDropdownMenuRadioGroup>

    <RekaDropdownMenuGroup v-else-if="item.type === 'group'">
      <RekaDropdownMenuLabel
        class="px-sm py-xs text-xs font-medium text-tertiary"
      >
        {{ item.label }}
      </RekaDropdownMenuLabel>
      <DropdownMenuContent
        :items="item.items"
      />
    </RekaDropdownMenuGroup>
  </template>
</template>
