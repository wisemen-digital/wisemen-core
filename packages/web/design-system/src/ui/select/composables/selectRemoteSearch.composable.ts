import { watchDebounced } from '@vueuse/core'
import {
  computed,
  ref,
} from 'vue'

export function useSelectRemoteSearch() {
  const search = ref<string>('')
  const debouncedSearch = ref<string>(search.value)
  const isSearchEmpty = computed<boolean>(() => debouncedSearch.value.trim() === '')

  watchDebounced(
    search,
    (value) => {
      debouncedSearch.value = value
    },
    {
      debounce: 100,
    },
  )

  return {
    isSearchEmpty,
    debouncedSearch,
    search,
  }
}
