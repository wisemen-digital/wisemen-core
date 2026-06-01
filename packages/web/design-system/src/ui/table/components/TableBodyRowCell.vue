<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

import { useInjectTableContext } from '@/ui/table/context/table.context'
import { useInjectTableBodyRowContext } from '@/ui/table/context/tableBodyRow.context'
import { useInjectTableGroupContext } from '@/ui/table/context/tableGroup.context'
import { useInjectTableSubGroupContext } from '@/ui/table/context/tableSubGroup.context'

const {
  isScrolledFromLeft, variant,
} = useInjectTableContext()

const {
  link,
} = useInjectTableBodyRowContext({
  link: computed(() => null),
})

const {
  isGroup,
} = useInjectTableGroupContext({
  isGroup: false,
})

const {
  isSubGroup,
} = useInjectTableSubGroupContext({
  isSubGroup: false,
})

const firstCellPaddingLeft = computed<string>(() => {
  if (isSubGroup) {
    return 'first-of-type:pl-15'
  }

  if (isGroup) {
    return 'first-of-type:pl-10'
  }

  return 'first-of-type:pl-2xl'
})
</script>

<template>
  <div
    :class="[{
      'first-of-type:border-r first-of-type:border-secondary': isScrolledFromLeft,
      'h-10': variant === 'full-page',
      'h-9': variant === 'contained',
    }, firstCellPaddingLeft]"
    class="
      relative flex items-center overflow-hidden bg-primary px-xl
      not-group-has-[[data-row-actions]_[data-state=open]]/row:group-hover/row:bg-secondary
      group-has-focus-visible/row:bg-tertiary
      first-of-type:sticky first-of-type:left-0 first-of-type:z-2
      last-of-type:pr-2xl
    "
  >
    <RouterLink
      v-if="link !== null"
      :to="link"
      tabindex="-1"
      class="absolute inset-0 z-0"
    />

    <div
      class="pointer-events-none relative z-1 flex size-full items-center"
    >
      <slot />
    </div>
  </div>
</template>
