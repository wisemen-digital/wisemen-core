<script setup lang="ts">
import {
  UIActionDropdownMenu,
  UIClickableElement,
} from '@wisemen/vue-core-design-system'
import { computed } from 'vue'

import type {
  Filter,
  FilterWithAction,
} from '@/composables'
import { useInjectFiltersContext } from '@/context/filters.context'

const props = defineProps<{
  filter: FilterWithAction<Filter>
}>()

const {
  isFilterOpen,
  closeFilter,
  setOpenFilter,
} = useInjectFiltersContext()

const isOpen = computed<boolean>({
  get: () => isFilterOpen(props.filter.key),
  set: (isOpen) => {
    if (isOpen) {
      setOpenFilter(props.filter.key)

      return
    }

    closeFilter(props.filter.key)
  },
})
</script>

<template>
  <UIActionDropdownMenu
    v-model:is-open="isOpen"
    :parent-action="props.filter.action"
    :is-current-context-only="true"
    :fixed-content-position="true"
    popover-align="start"
    popover-side="bottom"
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
