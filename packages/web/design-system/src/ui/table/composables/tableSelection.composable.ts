import type { TableSelectionState as ActionTableSelectionState } from '@wisemen/vue-core-actions'
import { useActionManagerStore } from '@wisemen/vue-core-actions'
import {
  computed,
  onBeforeUnmount,
} from 'vue'

const EMPTY_SELECTION: ActionTableSelectionState = {
  items: [],
  type: 'include',
}

export function useTableSelection<T>(
  getKey: (item: T) => string,
) {
  const manager = useActionManagerStore()

  manager.setTableSelection(EMPTY_SELECTION)

  function selection(): ActionTableSelectionState {
    return manager.tableSelection ?? EMPTY_SELECTION
  }

  function setSelection(next: ActionTableSelectionState): void {
    manager.setTableSelection(next)
  }

  const isAllSelected = computed<boolean>(
    () => selection().type === 'exclude' && selection().items.length === 0,
  )

  const isIndeterminate = computed<boolean>(() => selection().items.length > 0)

  function isItemSelected(key: string): boolean {
    const current = selection()

    return current.type === 'include' ? current.items.includes(key) : !current.items.includes(key)
  }

  function toggleItem(key: string): void {
    const current = selection()
    const items = current.items.includes(key)
      ? current.items.filter((item) => item !== key)
      : [
          ...current.items,
          key,
        ]

    setSelection({
      items,
      type: current.type,
    })
  }

  function toggleAll(): void {
    if (isAllSelected.value) {
      setSelection({
        items: [],
        type: 'include',
      })
    }
    else {
      setSelection({
        items: [],
        type: 'exclude',
      })
    }
  }

  function clearSelection(): void {
    manager.clearTableSelection()
  }

  function isGroupAllSelected(items: T[]): boolean {
    return items.length > 0 && items.every((item) => isItemSelected(getKey(item)))
  }

  function isGroupIndeterminate(items: T[]): boolean {
    const count = items.filter((item) => isItemSelected(getKey(item))).length

    return count > 0 && count < items.length
  }

  function toggleGroup(items: T[]): void {
    const current = selection()
    const groupKeys = items.map((item) => getKey(item))

    if (isGroupAllSelected(items)) {
      setSelection(current.type === 'include'
        ? {
            items: current.items.filter((key) => !groupKeys.includes(key)),
            type: current.type,
          }
        : {
            items: [
              ...new Set([
                ...current.items,
                ...groupKeys,
              ]),
            ],
            type: current.type,
          })
    }
    else {
      setSelection(current.type === 'include'
        ? {
            items: [
              ...new Set([
                ...current.items,
                ...groupKeys,
              ]),
            ],
            type: current.type,
          }
        : {
            items: current.items.filter((key) => !groupKeys.includes(key)),
            type: current.type,
          })
    }
  }

  onBeforeUnmount(() => {
    manager.setTableSelection(null)
  })

  return {
    isAllSelected,
    isGroupAllSelected,
    isGroupIndeterminate,
    isIndeterminate,
    isItemSelected,
    clearSelection,
    toggleAll,
    toggleGroup,
    toggleItem,
  }
}
