<script setup lang="ts">
import {
  UIActionDropdownMenu,
  UIClickableElement,
} from '@wisemen/vue-core-design-system'

import type {
  Filter,
  FilterWithAction,
} from '@/composables'
import { useInjectFiltersContext } from '@/context/filters.context'

const props = defineProps<{
  filter: FilterWithAction<Filter>
}>()

const {
  clearFilter, setOpenFilter,
} = useInjectFiltersContext()

function onUpdateIsOpen(isOpen: boolean): void {
  if (isOpen) {
    setOpenFilter(props.filter.key)
  }
  else {
    setOpenFilter(null)

    if (props.filter.isStatic !== true) {
      clearFilter(props.filter.key, true)
    }
  }
}
</script>

<template>
  <UIActionDropdownMenu
    :parent-action="props.filter.action"
    :current-context-only="true"
    popover-align="start"
    popover-side="bottom"
    @update:is-open="onUpdateIsOpen"
  >
    <UIClickableElement>
      <button
        type="button"
        class="size-full"
      >
        <slot />
      </button>
    </UIClickableElement>
  </UIActionDropdownMenu>
</template>
