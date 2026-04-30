import { watchDebounced } from '@vueuse/core'
import { useFilter } from 'reka-ui'
import type {
  ComputedRef,
  Ref,
} from 'vue'
import {
  computed,
  ref,
} from 'vue'

import type { AutocompleteDisplayFn } from '@/ui/autocomplete/autocomplete.props'
import type {
  AutocompleteItem,
  AutocompleteValue,
} from '@/ui/autocomplete/autocomplete.type'

export function useAutocompleteSearch<TValue extends AutocompleteValue>(
  items: ComputedRef<AutocompleteItem<TValue>[]>,
  searchTerm: Ref<string>,
  displayFn: AutocompleteDisplayFn<TValue>,
  mode: 'local' | 'remote',
) {
  const {
    contains,
  } = useFilter({
    sensitivity: 'base',
  })

  const debouncedSearch = ref<string>(searchTerm.value)

  watchDebounced(
    searchTerm,
    (value) => {
      debouncedSearch.value = value
    },
    {
      debounce: 100,
    },
  )

  const isSearchEmpty = computed<boolean>(() => searchTerm.value.trim().length === 0)

  const filteredItems = computed<AutocompleteItem<TValue>[]>(() => {
    if (mode === 'remote') {
      return items.value
    }

    if (isSearchEmpty.value) {
      return items.value
    }

    return items.value.filter((item) => {
      if (item.type !== 'option') {
        return true
      }

      return contains(displayFn(item.value as NonNullable<TValue>), searchTerm.value)
    })
  })

  return {
    isSearchEmpty,
    debouncedSearch,
    filteredItems,
  }
}
