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
      'z-30': isLeadingStickyRegionActive,
    }"
    class="
      sticky top-0 z-20 flex h-10 items-center border-b border-secondary
      bg-secondary px-xl
    "
    role="columnheader"
  >
    <BaseCheckbox
      :model-value="props.isChecked"
      :is-indeterminate="props.isIndeterminate ?? false"
      :is-label-hidden="true"
      :label="i18n.t('component.table.header.select_all_label')"
      @update:model-value="emit('toggle')"
    />
  </div>
</template>
