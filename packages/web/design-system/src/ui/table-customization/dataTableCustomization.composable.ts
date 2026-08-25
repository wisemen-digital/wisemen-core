import type { ActionGroup } from '@wisemen/vue-core-actions'
import { createAction } from '@wisemen/vue-core-actions'
import { Columns03Icon } from '@wisemen/vue-core-icons'
import type { ComputedRef } from 'vue'
import {
  computed,
  ref,
} from 'vue'
import { useI18n } from 'vue-i18n'

import type { DataTableColumn } from '@/ui/data-table/types/dataTableColumn.type'
import { useOverlay } from '@/ui/dialog/index'
import type { TableColumnState } from '@/ui/table-customization/tableCustomization.composable'
import TableCustomizationDialog from '@/ui/table-customization/TableCustomizationDialog.vue'

interface UseDataTableCustomizeColumnsOptions<T, TKey extends string> {
  actionGroup: ActionGroup
  availableColumns: ComputedRef<DataTableColumn<T, TKey>[]>
  initialState?: TKey[]
}

export function useDataTableCustomizeColumns<T, TKey extends string>(
  options: UseDataTableCustomizeColumnsOptions<T, TKey>,
) {
  const i18n = useI18n()
  const overlay = useOverlay()
  const dialog = overlay.create(TableCustomizationDialog)

  const columnStates = ref<TableColumnState[]>(
    options.availableColumns.value
      .map((col) => ({
        isVisible:
        options.initialState === undefined
        || options.initialState.length === 0
        || options.initialState.includes(col.key),
        column: col,
      }))
      .sort((a, b) => {
        if (options.initialState === undefined || options.initialState.length === 0) {
          return 0
        }

        const aIndex = options.initialState.indexOf(a.column.key as TKey)
        const bIndex = options.initialState.indexOf(b.column.key as TKey)

        if (aIndex !== -1 && bIndex !== -1) {
          return aIndex - bIndex
        }
        if (aIndex !== -1) {
          return -1
        }
        if (bIndex !== -1) {
          return 1
        }

        return 0
      }),
  )

  const customizedColumns = computed<DataTableColumn<T, TKey>[]>(
    () =>
      columnStates.value
        .filter((state) => state.isVisible)
        .map((state) => state.column as DataTableColumn<T, TKey>),
  )

  const customizeTableAction = createAction({
    id: 'data-table-customization-dialog',
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

  function setState(state: TKey[]): void {
    columnStates.value = options.availableColumns.value
      .map((col) => ({
        isVisible: state.length === 0 || state.includes(col.key),
        column: col,
      }))
      .sort((a, b) => {
        if (state.length === 0) {
          return 0
        }

        const aIndex = state.indexOf(a.column.key as TKey)
        const bIndex = state.indexOf(b.column.key as TKey)

        if (aIndex !== -1 && bIndex !== -1) {
          return aIndex - bIndex
        }
        if (aIndex !== -1) {
          return -1
        }
        if (bIndex !== -1) {
          return 1
        }

        return 0
      })
  }

  return {
    customizedColumns,
    customizeTableAction,
    setState,
  }
}
