<script setup lang="ts">
import { FilterLinesIcon } from '@wisemen/vue-core-icons'

import { UIIconButton } from '@/ui/button'
import type { DataTableFilter } from '@/ui/data-table/types/dataTableFilter.type'

const props = defineProps<{
  filter: DataTableFilter
}>()

function onClick(): void {
  props.filter.open()
}
</script>

<template>
  <UIIconButton
    :aria-pressed="props.filter.isActive ?? false"
    :class="{
      'bg-fg-primary/5': props.filter.isActive === true,
    }"
    :icon="FilterLinesIcon"
    :label="props.filter.label"
    :tooltip-label="props.filter.label"
    size="xs"
    variant="tertiary"
    @click="onClick"
  />
</template>
