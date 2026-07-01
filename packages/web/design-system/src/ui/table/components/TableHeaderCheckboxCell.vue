<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import BaseCheckbox from '@/ui/checkbox/base/BaseCheckbox.vue'
import TableHeaderCellBase from '@/ui/table/components/TableHeaderCellBase.vue'
import { useInjectTableSelectionContext } from '@/ui/table/context/tableSelection.context'

const i18n = useI18n()

const {
  isAllSelected,
  isIndeterminate,
  toggleAll,
} = useInjectTableSelectionContext()
</script>

<template>
  <TableHeaderCellBase>
    <BaseCheckbox
      :model-value="isAllSelected || isIndeterminate"
      :is-indeterminate="isIndeterminate && !isAllSelected"
      :is-label-hidden="true"
      :label="i18n.t('component.table.header.select_all_label')"
      @update:model-value="toggleAll"
    />
  </TableHeaderCellBase>
</template>
