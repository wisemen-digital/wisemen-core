import type { Ref } from 'vue'

import type { Sort } from './sort.type'

export interface QueryParams {
  filters?: Record<string, any>
  search?: string
  sort?: Sort[]
}

export interface WithSearchQuery {
  search?: string | undefined
}

export interface WithSortQuery<TKeys extends string> {
  sort: Sort<TKeys>[]
}

export interface WithFilterQuery<TFilters extends Record<string, any>> {
  filters?: TFilters
}

export interface WithStaticFilterQuery<TFilters extends Record<string, any>> {
  staticFilters: TFilters
}

export interface InfiniteQueryOptions<TParams> {
  params: {
    [K in keyof TParams]: Ref<TParams[K]>
  }
}
