import type { ActionGroup } from '@wisemen/vue-core-actions'
import { createAction } from '@wisemen/vue-core-actions'
import { Columns03Icon } from '@wisemen/vue-core-icons'
import type { ComputedRef } from 'vue'
import {
  computed,
  ref,
} from 'vue'
import { useI18n } from 'vue-i18n'

import { useOverlay } from '@/ui/dialog/index'
import type { TableColumn } from '@/ui/table/types/table.type'
import TableCustomizationDialog from '@/ui/table-customization/TableCustomizationDialog.vue'

export interface TableColumnState {
  isVisible: boolean
  column: TableColumn<unknown>
}

interface UseTableCustomizeColumnsOptions<T, TKey extends string> {
  actionGroup: ActionGroup
  availableColumns: ComputedRef<TableColumn<T, TKey>[]>
  initialState?: TKey[]
}

export function useTableCustomizeColumns<T, TKey extends string>(options: UseTableCustomizeColumnsOptions<T, TKey>) {
  const i18n = useI18n()
  const overlay = useOverlay()
  const dialog = overlay.create(TableCustomizationDialog)

  const columnStates = ref<TableColumnState[]>(
    options.availableColumns.value.map((col) => ({
      isVisible: options.initialState === undefined
        || options.initialState.length === 0
        || options.initialState.includes(col.key),
      column: col as TableColumn<unknown>,
    })),
  )

  const customizedColumns = computed<TableColumn<T, TKey>[]>(
    () =>
      columnStates.value
        .filter((state) => state.isVisible)
        .map((state) => state.column) as TableColumn<T, TKey>[],
  )

  const customizeTableAction = createAction({
    id: 'table-customization-dialog',
    name: () => i18n.t('component.table_customization.action.name'),
    execute: () => {
      dialog.open({
        columnStates: columnStates.value,
        onColumnStatesChange: (updatedStates: TableColumnState[]) => {
          columnStates.value = updatedStates
        },
      })
    },
    group: options.actionGroup,
    hint: () => {
      const hiddenColumnsCount = options.availableColumns.value.length - customizedColumns.value.length

      if (hiddenColumnsCount === 0) {
        return null
      }

      return `${options.availableColumns.value.length - customizedColumns.value.length} hidden`
    },
    icon: () => Columns03Icon,
    keyboardShortcut: {
      key: 'C',
      shift: true,
    },
  })

  return {
    customizedColumns,
    customizeTableAction,
  }
}
