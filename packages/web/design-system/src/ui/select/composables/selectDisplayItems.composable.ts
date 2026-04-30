import type {
  ComputedRef,
  Ref,
} from 'vue'
import {
  computed,
  ref,
} from 'vue'

import type { DisplayFn } from '@/ui/select/select.props'
import type {
  SelectItem,
  SelectOptionItem,
  SelectValue,
} from '@/ui/select/select.type'

type DisplayItem<TValue extends SelectValue | SelectValue[]> = SelectItem<TValue> & { key: string }

function generateKey(): string {
  return Math.random().toString(36).substring(2, 15)
}

export function useSelectDisplayItems<TValue extends SelectValue>(
  selectedOptions: Ref<SelectOptionItem<TValue>[]>,
  isSearchEmpty: ComputedRef<boolean>,
  isMultiple: boolean,
  displayFn: DisplayFn<TValue>,
) {
  const displayItems = ref<DisplayItem<NonNullable<TValue>>[]>([]) as Ref<DisplayItem<NonNullable<TValue>>[]>

  const selectedOptionsWithKey = computed<DisplayItem<TValue>[]>(
    () => selectedOptions.value.map((option) => ({
      ...option,
      key: generateKey(),
    }))
      .sort((a, b) => {
        const aLabel = displayFn(a.value as any)
        const bLabel = displayFn(b.value as any)

        return aLabel.localeCompare(bLabel)
      }),
  )

  function getNonSelectedItems(items: SelectItem<TValue>[]): DisplayItem<TValue>[] {
    return items
      .filter((item) => {
        if (item.type !== 'option') {
          return true
        }

        return !selectedOptions.value.some(
          (selectedOption) => JSON.stringify(selectedOption.value) === JSON.stringify(item.value),
        )
      })
      .map((item) => {
        if (item.type !== 'option') {
          return {
            ...item,
            key: generateKey(),
          }
        }

        return {
          ...item,
          key: generateKey(),
        }
      })
  }

  function createSeparatorItem(): DisplayItem<TValue> {
    return {
      key: generateKey(),
      type: 'separator',
    }
  }

  function sortBySelection(items: DisplayItem<TValue>[]): DisplayItem<NonNullable<TValue>>[] {
    return items.sort((a, b) => {
      if (a.type !== 'option' || b.type !== 'option') {
        return 0
      }

      const aIsSelected = selectedOptions.value.some(
        (selectedOption) => JSON.stringify(selectedOption.value) === JSON.stringify(a.value),
      )
      const bIsSelected = selectedOptions.value.some(
        (selectedOption) => JSON.stringify(selectedOption.value) === JSON.stringify(b.value),
      )

      if (aIsSelected && !bIsSelected) {
        return -1
      }

      if (!aIsSelected && bIsSelected) {
        return 1
      }

      return 0
    }) as DisplayItem<NonNullable<TValue>>[]
  }

  function createDisplayItemList(items: SelectItem<TValue>[]): void {
    const nonSelectedItems = getNonSelectedItems(items)
    const shouldGroup = isSearchEmpty.value
      && isMultiple
      && selectedOptionsWithKey.value.length > 0
      && nonSelectedItems.length > 0

    // When grouping is needed, separate selected and non-selected items with a separator
    if (shouldGroup) {
      displayItems.value = [
        ...selectedOptionsWithKey.value,
        createSeparatorItem(),
        ...nonSelectedItems,
      ] as DisplayItem<NonNullable<TValue>>[]

      return
    }

    let relevantItems: SelectItem<TValue>[] = []

    // When the search is empty and it's a multi select and there are selected options,
    // only show the selected options since we don't have any non-selected
    // items to show (if-clause above would have handled that)
    if (isSearchEmpty.value && isMultiple && selectedOptions.value.length > 0) {
      relevantItems = selectedOptions.value
    }
    // Otherwise, show all items
    else {
      relevantItems = items
    }

    const itemsToDisplay = relevantItems.map((item) => {
      if (item.type !== 'option') {
        return {
          ...item,
          key: generateKey(),
        }
      }

      return {
        ...item,
        key: generateKey(),
      }
    })

    if (isMultiple) {
      displayItems.value = sortBySelection(itemsToDisplay)

      return
    }

    displayItems.value = itemsToDisplay as DisplayItem<NonNullable<TValue>>[]
  }

  return {
    createDisplayItemList,
    displayItems,
  }
}
