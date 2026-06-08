<script setup lang="ts">
import { computed } from 'vue'

import TableSubgrid from '@/ui/table/components/TableSubgrid.vue'
import { useInjectTableContext } from '@/ui/table/context/table.context'

const {
  isScrollableVertically, variant,
} = useInjectTableContext()

const shouldHideLastRowBorder = computed<boolean>(
  () => isScrollableVertically.value || variant.value === 'contained',
)
</script>

<template>
  <TableSubgrid
    :class="{
      '[&>*:last-child]:border-b-0': shouldHideLastRowBorder }
    "
    class="group/body"
  >
    <slot />
  </TableSubgrid>
</template>
