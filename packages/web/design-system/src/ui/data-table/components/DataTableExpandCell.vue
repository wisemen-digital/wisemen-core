<script setup lang="ts">
import { ChevronRightIcon } from '@wisemen/vue-core-icons'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { useInjectDataTableContext } from '@/ui/data-table/context/dataTable.context'

const props = defineProps<{
  isExpanded: boolean
  canExpand: boolean
}>()

const emit = defineEmits<{
  toggle: []
}>()

const i18n = useI18n()

const {
  hasExpandOwnStickyBorder,
  isLeadingStickyRegionActive,
  isScrolledFromLeft,
  leadingStickyOffsetsPx,
} = useInjectDataTableContext()

const label = computed<string>(() => (props.isExpanded
  ? i18n.t('component.data_table.expand_cell.collapse_label')
  : i18n.t('component.data_table.expand_cell.expand_label')))

const hasBorder = computed<boolean>(() => hasExpandOwnStickyBorder.value && isScrolledFromLeft.value)
</script>

<template>
  <div
    :style="{
      left: isLeadingStickyRegionActive ? `${leadingStickyOffsetsPx.expand}px` : undefined,
    }"
    :class="{
      'sticky z-2': isLeadingStickyRegionActive,
      'border-r border-secondary': hasBorder,
    }"
    class="
      flex h-10 items-center justify-center overflow-hidden bg-primary px-sm
      text-xs text-primary
      group-hover/row:bg-primary-hover
      group-has-focus-visible/row:bg-primary-hover
    "
    role="cell"
  >
    <button
      v-if="props.canExpand"
      :aria-label="label"
      class="
        flex size-6 shrink-0 items-center justify-center rounded-sm outline-none
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
