import { useRouteQuery } from '@vueuse/router'
import { StringUtil } from '@wisemen/vue-core-utils'
import type { ComputedRef } from 'vue'
import {
  computed,
  ref,
  watch,
} from 'vue'

interface Options {
  debounceMs?: number
  persistInUrl?: boolean | string
}

const DEFAULT_DEBOUNCE_MS = 50
const DEFAULT_ROUTE_QUERY_KEY = 'search'

export function useSearch(options?: Options) {
  const persistInUrl = options?.persistInUrl === false ? false : options?.persistInUrl ?? DEFAULT_ROUTE_QUERY_KEY

  const search = persistInUrl === true || typeof persistInUrl === 'string'
    ? useRouteQuery('search', '', {
        mode: 'replace',
      })
    : ref<string>('')

  const debouncedSearch = ref<string>(search.value)
  const isDebouncing = ref<boolean>(false)
  const isActive = computed<boolean>(() => !StringUtil.isEmpty(debouncedSearch.value))

  let debounceTimeout: ReturnType<typeof setTimeout> | null = null

  function clear(): void {
    search.value = ''
    debouncedSearch.value = ''
    isDebouncing.value = false

    if (debounceTimeout) {
      clearTimeout(debounceTimeout)
    }
  }

  watch(search, (value) => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout)
    }

    isDebouncing.value = true

    debounceTimeout = setTimeout(() => {
      debouncedSearch.value = value
      isDebouncing.value = false
    }, options?.debounceMs ?? DEFAULT_DEBOUNCE_MS)
  }, {
    immediate: true,
  })

  function updateSearch(value: string): void {
    search.value = value
  }

  return {
    isActive,
    isDebouncing,
    clear,
    debouncedSearch: debouncedSearch as ComputedRef<string>,
    search,
    updateSearch,
  }
}

export type Search = ReturnType<typeof useSearch>
