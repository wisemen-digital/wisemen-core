import type {
  Sort,
  SortValue,
} from '@wisemen/vue-core-design-system'

import { createCustomViewStateAdapter } from '@/types/customViewStateAdapter.type'

// eslint-disable-next-line eslint-plugin-wisemen/explicit-function-return-type-with-regex
export function createCustomViewSortStateAdapter<TKey extends string>(sort: Sort<TKey>) {
  return createCustomViewStateAdapter<'sort', SortValue<TKey>[]>({
    isDirty: (savedState, currentState) => {
      const saved = savedState ?? []

      if (saved.length !== currentState.length) {
        return true
      }

      return saved.some((sortValue, sortIndex) => {
        const currentSortState = currentState[sortIndex]

        return currentSortState == null
          || sortValue.key !== currentSortState.key
          || sortValue.direction !== currentSortState.direction
      })
    },
    apply: (state) => {
      sort.resetSort()

      if (state === null) {
        return
      }

      // Iterate in reverse because toggleSort prepends in multi-sort mode,
      // so reversing restores the original sort order.
      for (const {
        direction, key,
      } of state.toReversed()) {
        sort.toggleSort(key)

        if (direction === 'desc') {
          sort.toggleSort(key)
        }
      }
    },
    deserialize: (raw) => raw as SortValue<TKey>[],
    getCurrentState: () => sort.values.value,
    getDefaultState: () => [],
    key: 'sort',
    serialize: (state) => state,
  })
}
