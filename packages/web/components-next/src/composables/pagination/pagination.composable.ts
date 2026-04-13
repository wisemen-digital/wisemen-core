import { useRouteQuery } from '@vueuse/router'
import {
  computed,
  shallowRef,
  toValue,
  watch,
} from 'vue'

import { useInjectConfigContext } from '@/components/config-provider/config.context'
import type {
  BasePagination,
  FilterChangeEvent,
  PageChangeEvent,
  PaginationFilters,
  PaginationOptions,
  SortChangeEvent,
  UsePaginationProps,
  UsePaginationReturnType,
} from '@/composables/pagination/pagination.type'
import {
  base64Decode,
  base64Encode,
} from '@/composables/pagination/pagination.util'

const DEFAULT_LIMIT = 20

export function usePagination<TPagination extends BasePagination>({
  isRouteQueryEnabled,
  key: routeQueryKey,
  options = null,
  type = 'offset',
}: UsePaginationProps<TPagination>): UsePaginationReturnType<TPagination> {
  const globalConfigContext = useInjectConfigContext()

  const DEFAULT_PAGINATION_OPTIONS: PaginationOptions<TPagination> = {
    filter: {} as PaginationFilters<TPagination['filter']>,
    pagination: type === 'offset'
      ? {
          limit: globalConfigContext.pagination?.limit ?? DEFAULT_LIMIT,
          offset: 0,
          type: 'offset',
        }
      : {
          key: null,
          limit: globalConfigContext.pagination?.limit ?? DEFAULT_LIMIT,
          type: 'keyset',
        },
    search: undefined,
    sort: undefined,
    staticFilters: {} as PaginationFilters<TPagination['filter']>,
  } as const

  if (isRouteQueryEnabled && routeQueryKey === undefined) {
    throw new Error('The `key` prop is required when using the `isRouteQueryEnabled` prop')
  }

  const routeQuery = isRouteQueryEnabled ? useRouteQuery(routeQueryKey as string) : null
  const paginationOptions = shallowRef<PaginationOptions<TPagination>>(getDefaultPaginationOptions())

  function mergePaginationOptions(
    userOptions: PaginationOptions<TPagination>,
    currentOptions: PaginationOptions<TPagination>,
  ): PaginationOptions<TPagination> {
    const mergedFilters = {
      ...currentOptions.filter,
      ...userOptions.filter,
    } as PaginationFilters<TPagination['filter']>

    const search = currentOptions.search ?? userOptions.search ?? ''

    return {
      filter: mergedFilters,
      pagination: {
        ...currentOptions.pagination,
        ...userOptions.pagination,
      },
      search: search.trim().length > 0 ? search : undefined,
      sort: currentOptions.sort ?? userOptions.sort ?? undefined,
      staticFilters: {
        ...currentOptions.staticFilters,
        ...userOptions.staticFilters,
      } as PaginationFilters<TPagination['filter']>,
    }
  }

  function getRouteQueryPaginationOptions(): PaginationOptions<TPagination> | null {
    if (routeQuery === null) {
      return null
    }

    const queryValue = routeQuery.value

    if (queryValue === null || queryValue === undefined) {
      return null
    }

    return JSON.parse(base64Decode(queryValue.toString()))
  }

  function getDefaultPaginationOptions(): PaginationOptions<TPagination> {
    const routeQueryPaginationOptions = getRouteQueryPaginationOptions()

    if (routeQueryPaginationOptions !== null) {
      return routeQueryPaginationOptions
    }

    if (options !== null) {
      return mergePaginationOptions(
        toValue(options as PaginationOptions<TPagination>),
        DEFAULT_PAGINATION_OPTIONS as PaginationOptions<TPagination>,
      )
    }

    return structuredClone(DEFAULT_PAGINATION_OPTIONS as PaginationOptions<TPagination>)
  }

  function handlePageChange(event: PageChangeEvent): void {
    paginationOptions.value = {
      ...paginationOptions.value,
      pagination: {
        ...paginationOptions.value.pagination,
        ...event,
      },
    }
  }

  function handleFilterChange(event: FilterChangeEvent<TPagination['filter']>): void {
    const filtersWithoutUndefinedValues = Object.fromEntries(
      Object.entries({
        ...paginationOptions.value.filter,
        ...event,
      }).filter(([
        , value,
      ]) => value !== undefined),
    ) as PaginationFilters<TPagination['filter']>

    paginationOptions.value = {
      ...paginationOptions.value,
      filter: filtersWithoutUndefinedValues,
      pagination: type === 'offset'
        ? {
            ...paginationOptions.value.pagination,
            offset: 0,
            type: 'offset',
          }
        : {
            ...paginationOptions.value.pagination,
            key: null,
            type: 'keyset',
          },
    }
  }

  function handleSearchChange(value: string): void {
    paginationOptions.value = {
      ...paginationOptions.value,
      pagination: type === 'offset'
        ? {
            ...paginationOptions.value.pagination,
            offset: 0,
            type: 'offset',
          }
        : {
            ...paginationOptions.value.pagination,
            key: null,
            type: 'keyset',
          },
      search: value.trim().length > 0 ? value : undefined,
    }
  }

  function handleSortChange(event: SortChangeEvent<TPagination['sort']>): void {
    paginationOptions.value = {
      ...paginationOptions.value,
      sort: {
        key: event.key as `${TPagination['sort']}`,
        order: event.order,
      },
    }
  }

  function clearFilters(): void {
    paginationOptions.value = {
      ...paginationOptions.value,
      filter: {} as PaginationFilters<TPagination['filter']>,
      pagination: type === 'offset'
        ? {
            ...paginationOptions.value.pagination,
            offset: 0,
            type: 'offset',
          }
        : {
            ...paginationOptions.value.pagination,
            key: null,
            type: 'keyset',
          },
    }
  }

  watch(() => toValue(options), (newOptions) => {
    if (newOptions === null) {
      return
    }

    paginationOptions.value = mergePaginationOptions(
      toValue(newOptions as PaginationOptions<TPagination>),
      paginationOptions.value,
    )
  })

  watch(paginationOptions, (newPaginationOptions) => {
    if (!isRouteQueryEnabled) {
      return
    }

    if (routeQuery !== null) {
      routeQuery.value = base64Encode(JSON.stringify(newPaginationOptions))
    }
  })

  return {
    clearFilters,
    handleFilterChange,
    handlePageChange,
    handleSearchChange,
    handleSortChange,
    paginationOptions: computed<PaginationOptions<TPagination>>(() => paginationOptions.value),
  }
}
