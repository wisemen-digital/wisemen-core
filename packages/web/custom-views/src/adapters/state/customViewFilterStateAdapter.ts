import type { PlainDateRange } from '@wisemen/vue-core-dates'
import type {
  Filter,
  FilterValues,
  useFilters,
} from '@wisemen/vue-core-filters'
import { Temporal } from 'temporal-polyfill'

import { createCustomViewStateAdapter } from '@/types/customViewStateAdapter.type'

function isPlainDateRange(obj: unknown): obj is PlainDateRange {
  if (obj == null || typeof obj !== 'object') {
    return false
  }

  return 'from' in (obj as object) && 'until' in (obj as object)
}

function serializeValue(value: unknown): unknown {
  if (isPlainDateRange(value)) {
    return {
      from: value.from?.toString() ?? null,
      until: value.until?.toString() ?? null,
    }
  }

  return value
}

function deserializeValue(value: unknown): unknown {
  if (isPlainDateRange(value)) {
    return {
      from: typeof value.from === 'string' ? Temporal.PlainDate.from(value.from) : null,
      until: typeof value.until === 'string' ? Temporal.PlainDate.from(value.until) : null,
    }
  }

  return value
}

function serializeFilterValues<TFilters extends Filter[]>(
  state: FilterValues<TFilters>,
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(state as Record<string, unknown>).map(([
      key,
      value,
    ]) => [
      key,
      serializeValue(value),
    ]),
  )
}

// eslint-disable-next-line eslint-plugin-wisemen/explicit-function-return-type-with-regex
export function createCustomViewFilterStateAdapter<TFilters extends Filter[]>(
  filters: ReturnType<typeof useFilters<TFilters>>,
  defaultFilterValues: FilterValues<TFilters>,
) {
  return createCustomViewStateAdapter<'filters', FilterValues<TFilters>>({
    isDirty: (savedState, currentState) => {
      const savedObj = serializeFilterValues(savedState ?? defaultFilterValues)
      const currentObj = serializeFilterValues(currentState)

      return Object.keys(savedObj).some((key) => {
        const current = JSON.stringify(currentObj[key])
        const saved = JSON.stringify(savedObj[key])

        return current !== saved
      })
    },
    apply: (state) => {
      filters.values.value = {
        ...defaultFilterValues,
        ...state,
      }
    },
    deserialize: (raw) => {
      const rawObj = raw as Record<string, unknown>

      return Object.fromEntries(
        Object.entries(rawObj).map(([
          key,
          value,
        ]) => [
          key,
          deserializeValue(value),
        ]),
      ) as FilterValues<TFilters>
    },
    getCurrentState: () => filters.values.value,
    getDefaultState: () => ({
      ...defaultFilterValues,
    }),
    key: 'filters',
    serialize: (state) => serializeFilterValues(state),
  })
}
