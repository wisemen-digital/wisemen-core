import type { Search } from '@wisemen/vue-core-design-system'

import { createCustomViewStateAdapter } from '@/types/customViewStateAdapter.type'

// eslint-disable-next-line eslint-plugin-wisemen/explicit-function-return-type-with-regex
export function createCustomViewSearchStateAdapter(search: Search) {
  return createCustomViewStateAdapter({
    isDirty: (savedState, currentState) => savedState.trim() !== currentState.trim(),
    apply: search.updateSearch,
    deserialize: (raw) => raw as string,
    getCurrentState: () => search.search.value,
    getDefaultState: () => '',
    key: 'search',
    serialize: (state) => state,
  })
}
