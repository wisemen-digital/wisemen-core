<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import { UIActionTooltip } from '@/ui/action-tooltip'
import BaseCheckbox from '@/ui/checkbox/base/BaseCheckbox.vue'
import TableBodyRowCell from '@/ui/table/components/TableBodyRowCell.vue'
import TableBodyRowCellInteractiveElement from '@/ui/table/components/TableBodyRowCellInteractiveElement.vue'
import { useInjectTableSelectionContext } from '@/ui/table/context/tableSelection.context'

const props = defineProps<{
  itemKey: string
}>()

const i18n = useI18n()

const {
  isItemSelected, toggleItem,
} = useInjectTableSelectionContext()
</script>

<template>
  <TableBodyRowCell>
    <UIActionTooltip
      :keyboard-shortcut="{
        key: 'X',
      }"
      :label="i18n.t('component.table.row.toggle_selection_action.name')"
    >
      <TableBodyRowCellInteractiveElement>
        <BaseCheckbox
          :model-value="isItemSelected(props.itemKey)"
          :label="i18n.t('component.table.row.toggle_selection_action.name')"
          is-label-hidden
          @update:model-value="toggleItem(props.itemKey)"
        />
      </TableBodyRowCellInteractiveElement>
    </UIActionTooltip>
  </TableBodyRowCell>
</template>
