<script setup lang="ts">
import { ChevronRightIcon } from '@wisemen/vue-core-icons'

import { useInjectDataTableContext } from '@/ui/data-table/context/dataTable.context'

const props = defineProps<{
  isExpanded: boolean
  canExpand: boolean
}>()

const emit = defineEmits<{
  toggle: []
}>()

const {
  isLeadingStickyRegionActive, leadingStickyOffsetsPx,
} = useInjectDataTableContext()
</script>

<template>
  <div
    :style="{
      left: isLeadingStickyRegionActive ? `${leadingStickyOffsetsPx.expand}px` : undefined,
    }"
    :class="{
      'sticky z-1': isLeadingStickyRegionActive,
    }"
    class="
      flex h-10 items-center overflow-hidden bg-primary px-xl text-xs
      text-primary
    "
    role="cell"
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
  </div>
</template>
