import { useFilter } from 'reka-ui'
import type { ComputedRef } from 'vue'
import {
  computed,
  ref,
} from 'vue'

import type { DisplayFn } from '@/ui/select/select.props'
import type {
  SelectItem,
  SelectValue,
} from '@/ui/select/select.type'

export function useSelectLocalSearch<TValue extends SelectValue>(
  items: ComputedRef<SelectItem<TValue>[]>,
  displayFn: DisplayFn<TValue>,
) {
  const search = ref<string>('')

  const {
    contains,
  } = useFilter({
    sensitivity: 'base',
  })

  function onSearch(value: string): void {
    search.value = value
  }

  const filteredItems = computed<SelectItem<TValue>[]>(() => items.value.filter((item) => {
    const isSearchEmpty = search.value.trim().length === 0

    if (isSearchEmpty) {
      return true
    }

    if (item.type !== 'option') {
      return true
    }

    return contains(displayFn(item.value as any), search.value)
  }))

  return {
    locallyFilteredItems: filteredItems,
    localSearch: search,
    onSearchLocally: onSearch,
  }
}
