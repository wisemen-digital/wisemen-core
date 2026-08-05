import type { ComputedRef } from 'vue'
import {
  computed,
  ref,
  watch,
} from 'vue'

import type { TableSelectionState } from '@/ui/table/types/table.type'

export function useTableSelection<T>(
  allItems: ComputedRef<T[]>,
  getKey: (item: T) => string,
  onSelect: (state: TableSelectionState<T>) => void,
) {
  const mode = ref<'excludes' | 'includes'>('includes')
  const keys = ref(new Set<string>())

  const isAllSelected = computed<boolean>(() => mode.value === 'excludes' && keys.value.size === 0)

  const isIndeterminate = computed<boolean>(() => {
    if (mode.value === 'includes') {
      return keys.value.size > 0
    }

    return keys.value.size > 0
  })

  function isItemSelected(key: string): boolean {
    if (mode.value === 'includes') {
      return keys.value.has(key)
    }

    return !keys.value.has(key)
  }

  function toggleItem(key: string): void {
    const updated = new Set(keys.value)

    if (updated.has(key)) {
      updated.delete(key)
    }
    else {
      updated.add(key)
    }

    keys.value = updated
  }

  function toggleAll(): void {
    if (isAllSelected.value) {
      mode.value = 'includes'
      keys.value = new Set()
    }
    else {
      mode.value = 'excludes'
      keys.value = new Set()
    }
  }

  function isGroupAllSelected(items: T[]): boolean {
    return items.length > 0 && items.every((item) => isItemSelected(getKey(item)))
  }

  function isGroupIndeterminate(items: T[]): boolean {
    const count = items.filter((item) => isItemSelected(getKey(item))).length

    return count > 0 && count < items.length
  }

  function toggleGroup(items: T[]): void {
    if (isGroupAllSelected(items)) {
      const updated = new Set(keys.value)

      if (mode.value === 'includes') {
        for (const item of items) {
          updated.delete(getKey(item))
        }
      }
      else {
        for (const item of items) {
          updated.add(getKey(item))
        }
      }

      keys.value = updated
    }
    else {
      const updated = new Set(keys.value)

      if (mode.value === 'includes') {
        for (const item of items) {
          updated.add(getKey(item))
        }
      }
      else {
        for (const item of items) {
          updated.delete(getKey(item))
        }
      }

      keys.value = updated
    }
  }

  watch([
    mode,
    keys,
  ], () => {
    const currentKeys = keys.value
    const currentMode = mode.value
    const items = allItems.value.filter((item) => currentKeys.has(getKey(item)))

    onSelect({
      items,
      type: currentMode,
    })
  }, {
    deep: true,
  })

  return {
    isAllSelected,
    isGroupAllSelected,
    isGroupIndeterminate,
    isIndeterminate,
    isItemSelected,
    toggleAll,
    toggleGroup,
    toggleItem,
  }
}
