import type {
  ComputedRef,
  Ref,
} from 'vue'
import {
  computed,
  ref,
} from 'vue'

import type {
  DisplayFn,
  GetItemKeyFn,
} from '@/ui/select/select.props'
import type {
  SelectItem,
  SelectOptionItem,
  SelectValue,
} from '@/ui/select/select.type'

type DisplayItem<TValue extends SelectValue> = SelectItem<TValue> & { key: string }

export function useSelectDisplayItems<TValue extends SelectValue>(
  selectedOptions: Ref<SelectOptionItem<TValue>[]>,
  isSearchEmpty: ComputedRef<boolean>,
  isMultiple: boolean,
  displayFn: DisplayFn<TValue>,
  getItemKey?: GetItemKeyFn<TValue> | null,
) {
  const displayItems = ref<DisplayItem<NonNullable<TValue>>[]>([]) as Ref<DisplayItem<NonNullable<TValue>>[]>

  function keyFor(value: NonNullable<TValue>): string {
    return getItemKey?.(value as any)?.toString() ?? JSON.stringify(value)
  }

  function isSameOption(a: NonNullable<TValue>, b: NonNullable<TValue>): boolean {
    return keyFor(a) === keyFor(b)
  }

  const selectedOptionsWithKey = computed<DisplayItem<TValue>[]>(
    () => selectedOptions.value.map((option) => ({
      ...option,
      key: `option-${keyFor(option.value as NonNullable<TValue>)}`,
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

        return !selectedOptions.value.some((selectedOption) => isSameOption(
          selectedOption.value as NonNullable<TValue>,
          item.value as NonNullable<TValue>,
        ))
      })
      .map((item, index) => {
        if (item.type !== 'option') {
          return {
            ...item,
            key: `sep-${index}`,
          }
        }

        return {
          ...item,
          key: `option-${keyFor(item.value as NonNullable<TValue>)}`,
        }
      })
  }

  function createSeparatorItem(index: number): DisplayItem<TValue> {
    return {
      key: `sep-${index}`,
      type: 'separator',
    }
  }

  function sortBySelection(items: DisplayItem<TValue>[]): DisplayItem<NonNullable<TValue>>[] {
    return items.sort((a, b) => {
      if (a.type !== 'option' || b.type !== 'option') {
        return 0
      }

      const aIsSelected = selectedOptions.value.some((selectedOption) => isSameOption(
        selectedOption.value as NonNullable<TValue>,
        a.value as NonNullable<TValue>,
      ))
      const bIsSelected = selectedOptions.value.some((selectedOption) => isSameOption(
        selectedOption.value as NonNullable<TValue>,
        b.value as NonNullable<TValue>,
      ))

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
    const visibleItems = isSearchEmpty.value
      ? items
      : items.filter((item) => item.type !== 'separator')

    const nonSelectedItems = getNonSelectedItems(visibleItems)
    const shouldGroup = isSearchEmpty.value
      && isMultiple
      && selectedOptionsWithKey.value.length > 0
      && nonSelectedItems.length > 0

    // When grouping is needed, separate selected and non-selected items with a separator
    if (shouldGroup) {
      displayItems.value = [
        ...selectedOptionsWithKey.value,
        createSeparatorItem(-1),
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
      relevantItems = visibleItems
    }

    const itemsToDisplay = relevantItems.map((item, index) => {
      if (item.type !== 'option') {
        return {
          ...item,
          key: `sep-${index}`,
        }
      }

      return {
        ...item,
        key: `option-${keyFor(item.value as NonNullable<TValue>)}`,
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
