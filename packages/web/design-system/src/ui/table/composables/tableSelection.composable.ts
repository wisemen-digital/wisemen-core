import type { TableSelectionState as ActionTableSelectionState } from '@wisemen/vue-core-actions'
import { useActionManagerStore } from '@wisemen/vue-core-actions'
import type { ComputedRef } from 'vue'
import {
  computed,
  onBeforeUnmount,
  shallowRef,
} from 'vue'

const EMPTY_SELECTION: ActionTableSelectionState = {
  items: [],
  type: 'include',
}

export function useTableSelection<T>(
  getKey: (item: T) => string,
  orderedKeys: ComputedRef<string[]>,
) {
  const manager = useActionManagerStore()

  manager.setTableSelection(EMPTY_SELECTION)

  const lastToggledKey = shallowRef<string | null>(null)

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

  function selectKeys(keys: string[]): void {
    const current = selection()

    if (current.type === 'include') {
      setSelection({
        items: [
          ...new Set([
            ...current.items,
            ...keys,
          ]),
        ],
        type: 'include',
      })
    }
    else {
      setSelection({
        items: current.items.filter((key) => !keys.includes(key)),
        type: 'exclude',
      })
    }
  }

  function deselectKeys(keys: string[]): void {
    const current = selection()

    if (current.type === 'include') {
      setSelection({
        items: current.items.filter((key) => !keys.includes(key)),
        type: 'include',
      })
    }
    else {
      setSelection({
        items: [
          ...new Set([
            ...current.items,
            ...keys,
          ]),
        ],
        type: 'exclude',
      })
    }
  }

  function toggleItem(key: string, isRangeSelect = false): void {
    if (isRangeSelect && lastToggledKey.value !== null) {
      const keys = orderedKeys.value
      const fromIndex = keys.indexOf(lastToggledKey.value)
      const toIndex = keys.indexOf(key)

      if (fromIndex !== -1 && toIndex !== -1) {
        const start = Math.min(fromIndex, toIndex)
        const end = Math.max(fromIndex, toIndex)

        selectKeys(keys.slice(start, end + 1))

        return
      }
    }

    if (isItemSelected(key)) {
      deselectKeys([
        key,
      ])
    }
    else {
      selectKeys([
        key,
      ])
    }

    lastToggledKey.value = key
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
    const groupKeys = items.map((item) => getKey(item))

    if (isGroupAllSelected(items)) {
      deselectKeys(groupKeys)
    }
    else {
      selectKeys(groupKeys)
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
