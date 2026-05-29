import type { useTableCustomizeColumns } from '@wisemen/vue-core-design-system'

import { createCustomViewStateAdapter } from '@/types/customViewStateAdapter.type'

// eslint-disable-next-line eslint-plugin-wisemen/explicit-function-return-type-with-regex
export function createCustomViewTableColumnsStateAdapter<T, TKey extends string>(
  customizeColumns: ReturnType<typeof useTableCustomizeColumns<T, TKey>>,
) {
  const defaultState = customizeColumns.customizedColumns.value.map((column) => column.key)

  return createCustomViewStateAdapter({
    isDirty: (saved, current) => JSON.stringify(saved) !== JSON.stringify(current),
    apply: (state) => {
      customizeColumns.setState(state)
    },
    deserialize: (raw) => [
      ...raw as TKey[],
    ],
    getCurrentState: () => customizeColumns.customizedColumns.value.map((column) => column.key),
    getDefaultState: () => defaultState,
    key: 'columns',
    serialize: (state) => state,
  })
}
