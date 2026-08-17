<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import BaseCheckbox from '@/ui/checkbox/base/BaseCheckbox.vue'
import { useInjectDataTableContext } from '@/ui/data-table/context/dataTable.context'

const props = defineProps<{
  isChecked: boolean
  isIndeterminate?: boolean
}>()

const emit = defineEmits<{
  toggle: []
}>()

const i18n = useI18n()

const {
  isLeadingStickyRegionActive, leadingStickyOffsetsPx,
} = useInjectDataTableContext()
</script>

<template>
  <div
    :style="{
      left: isLeadingStickyRegionActive ? `${leadingStickyOffsetsPx.checkbox}px` : undefined,
    }"
    :class="{
      'sticky z-2': isLeadingStickyRegionActive,
    }"
    class="
      flex h-10 items-center overflow-hidden bg-primary px-xl text-xs
      text-primary
      group-hover/row:bg-primary-hover
      group-has-focus-visible/row:bg-tertiary
    "
    role="cell"
  >
    <BaseCheckbox
      :model-value="props.isChecked"
      :is-indeterminate="props.isIndeterminate ?? false"
      :is-label-hidden="true"
      :label="i18n.t('component.table.row.toggle_selection_action.name')"
      @update:model-value="emit('toggle')"
    />
  </div>
</template>
