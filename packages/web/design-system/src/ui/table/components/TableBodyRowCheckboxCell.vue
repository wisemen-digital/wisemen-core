<script setup lang="ts">
import { shallowRef } from 'vue'
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

// Captured on the click's capture phase — fires before the checkbox's own click handling
// resolves into `update:model-value` — so the shift state is available by the time we toggle.
const isShiftKeyPressed = shallowRef<boolean>(false)

function onClickCapture(event: MouseEvent): void {
  isShiftKeyPressed.value = event.shiftKey
}

function onToggle(): void {
  toggleItem(props.itemKey, isShiftKeyPressed.value)
}
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
          @click.capture="onClickCapture"
          @update:model-value="onToggle"
        />
      </TableBodyRowCellInteractiveElement>
    </UIActionTooltip>
  </TableBodyRowCell>
</template>
