<script setup lang="ts">
import { ChevronRightIcon } from '@wisemen/vue-core-icons'

import DataTableCell from '@/ui/data-table/components/DataTableCell.vue'

const props = defineProps<{
  isExpanded: boolean
  canExpand: boolean
}>()

const emit = defineEmits<{
  toggle: []
}>()
</script>

<template>
  <DataTableCell
    :is-first-column="true"
    :is-last-column="false"
  >
    <button
      v-if="props.canExpand"
      class="
        flex size-6 items-center justify-center rounded-sm outline-none
        hover:bg-secondary-hover
        focus-visible:bg-tertiary
      "
      type="button"
      @click="emit('toggle')"
    >
      <ChevronRightIcon
        :class="{
          'rotate-90': props.isExpanded,
        }"
        class="size-3.5 text-tertiary duration-150"
      />
    </button>
  </DataTableCell>
</template>
