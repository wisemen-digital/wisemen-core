<script setup lang="ts">
import {
  computed,
  shallowRef,
} from 'vue'
import { useI18n } from 'vue-i18n'

import { UIActionTooltip } from '@/ui/action-tooltip'
import BaseCheckbox from '@/ui/checkbox/base/BaseCheckbox.vue'
import { useInjectDataTableContext } from '@/ui/data-table/context/dataTable.context'

const props = defineProps<{
  isChecked: boolean
  isIndeterminate?: boolean
}>()

const emit = defineEmits<{
  toggle: [isRangeSelect: boolean]
}>()

const i18n = useI18n()

const {
  hasCheckboxOwnStickyBorder,
  isLeadingStickyRegionActive,
  isScrolledFromLeft,
  leadingStickyOffsetsPx,
} = useInjectDataTableContext()

const hasBorder = computed<boolean>(() => hasCheckboxOwnStickyBorder.value && isScrolledFromLeft.value)

// Captured on the click's capture phase — fires before the checkbox's own click handling
// resolves into `update:model-value` — so the shift state is available by the time we toggle.
const isShiftKeyPressed = shallowRef<boolean>(false)

function onClickCapture(event: MouseEvent): void {
  isShiftKeyPressed.value = event.shiftKey
}

function onToggle(): void {
  emit('toggle', isShiftKeyPressed.value)
}
</script>

<template>
  <div
    :style="{
      left: isLeadingStickyRegionActive ? `${leadingStickyOffsetsPx.checkbox}px` : undefined,
    }"
    :class="{
      'sticky z-2': isLeadingStickyRegionActive,
      'border-r border-secondary': hasBorder,
    }"
    class="
      flex h-10 items-center overflow-hidden bg-primary px-xl text-xs
      text-primary
      group-hover/row:bg-primary-hover
      group-has-focus-visible/row:bg-primary-hover
    "
    role="cell"
  >
    <UIActionTooltip
      :keyboard-shortcut="{
        key: 'X',
      }"
      :label="i18n.t('component.data_table.row.toggle_selection_action.name')"
    >
      <BaseCheckbox
        :model-value="props.isChecked"
        :is-indeterminate="props.isIndeterminate ?? false"
        :is-label-hidden="true"
        :label="i18n.t('component.data_table.row.toggle_selection_action.name')"
        @click.capture="onClickCapture"
        @update:model-value="onToggle"
      />
    </UIActionTooltip>
  </div>
</template>
