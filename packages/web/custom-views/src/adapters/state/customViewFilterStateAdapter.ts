import type {
  Filter,
  FilterValues,
  useFilters,
} from '@wisemen/vue-core-filters'

import { createCustomViewStateAdapter } from '@/types/customViewStateAdapter.type'

// eslint-disable-next-line eslint-plugin-wisemen/explicit-function-return-type-with-regex
export function createCustomViewFilterStateAdapter<TFilters extends Filter[]>(
  filters: ReturnType<typeof useFilters<TFilters>>,
  defaultFilterValues?: FilterValues<TFilters>
) {
  return createCustomViewStateAdapter({
    isDirty: (savedState, currentState) => {
      return JSON.stringify(savedState) !== JSON.stringify(currentState)
    },
    apply: (state) => {
      filters.values.value = state
    },
    deserialize: (raw) => ({
      ...raw as FilterValues<TFilters>,
    }),
    getCurrentState: () => filters.values.value,
    getDefaultState: () => ({
      ...defaultFilterValues,
    }),
    key: 'filters',
    serialize: (state) => state,
  })
}
