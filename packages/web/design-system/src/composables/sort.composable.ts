import {
  computed,
  shallowRef,
} from 'vue'

export type SortDirection = 'asc' | 'desc'

interface Options<TKey extends string = string> {
  enableMultiSort?: boolean
  initialValues?: SortValue<TKey>[]
  keys: TKey[]
}

export interface SortValue<TKey extends string = string> {
  direction: SortDirection
  key: TKey
}

export function useSort<TKey extends string>(options: Options<TKey>) {
  const sorts = shallowRef<SortValue<TKey>[]>(options?.initialValues ?? [])

  function toggleSort(key: TKey): void {
    const existingIndex = sorts.value.findIndex((s) => s.key === key)

    if (existingIndex !== -1) {
      const existing = sorts.value[existingIndex] ?? null

      if (existing === null) {
        return
      }

      if (existing.direction === 'asc') {
        sorts.value = options.enableMultiSort
          ? sorts.value.map(
              (s, index) =>
                index === existingIndex
                  ? {
                      ...s,
                      direction: 'desc',
                    }
                  : s,
            )
          : [
              {
                direction: 'desc',
                key,
              },
            ]
      }
      else {
        sorts.value = sorts.value.filter((_, index) => index !== existingIndex)
      }
    }
    else {
      sorts.value = options.enableMultiSort
        ? [
            {
              direction: 'asc',
              key,
            },
            ...sorts.value as SortValue<TKey>[],
          ]
        : [
            {
              direction: 'asc',
              key,
            },
          ]
    }
  }

  function existsSort(key: TKey): boolean {
    return options.keys.includes(key)
  }

  function getSort(key: TKey): SortValue<TKey> | null {
    return sorts.value.find((s) => s.key === key) ?? null
  }

  function resetSort(): void {
    sorts.value = []
  }

  return {
    existsSort,
    getSort,
    resetSort,
    toggleSort,
    values: computed<SortValue<TKey>[]>(() => sorts.value),
  }
}

export type Sort<TKey extends string = string> = ReturnType<typeof useSort<TKey>>
