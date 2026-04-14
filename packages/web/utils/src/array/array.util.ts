export class ArrayUtil {
  /**
   * Splits an array into chunks of the given size.
   * The final chunk may be smaller if the array does not divide evenly.
   *
   * @example
   * ArrayUtil.chunk([1, 2, 3, 4, 5], 2) // [[1, 2], [3, 4], [5]]
   */
  static chunk<T>(value: T[], size: number): T[][] {
    if (size <= 0) {
      return []
    }

    const chunks: T[][] = []

    for (let i = 0; i < value.length; i += size) {
      chunks.push(value.slice(i, i + size))
    }

    return chunks
  }

  /**
   * Groups array elements by the value of a given key.
   * Returns a `Map` where each key maps to an array of matching items.
   *
   * @example
   * const items = [{ type: 'a', v: 1 }, { type: 'b', v: 2 }, { type: 'a', v: 3 }]
   * ArrayUtil.groupBy(items, 'type')
   * // Map { 'a' => [{ type: 'a', v: 1 }, { type: 'a', v: 3 }], 'b' => [{ type: 'b', v: 2 }] }
   */
  static groupBy<T, K extends keyof T>(value: T[], key: K): Map<T[K], T[]> {
    const map = new Map<T[K], T[]>()

    for (const item of value) {
      const groupKey = item[key]
      const group = map.get(groupKey) ?? []

      group.push(item)
      map.set(groupKey, group)
    }

    return map
  }

  /**
   * Returns a sorted copy of the array by a given key.
   *
   * @example
   * const users = [{ name: 'Charlie' }, { name: 'Alice' }, { name: 'Bob' }]
   * ArrayUtil.sortBy(users, 'name') // [Alice, Bob, Charlie]
   * ArrayUtil.sortBy(users, 'name', 'desc') // [Charlie, Bob, Alice]
   */
  static sortBy<T>(value: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] {
    return value.toSorted((a, b) => {
      const aVal = a[key]
      const bVal = b[key]

      if (aVal < bVal) {
        return direction === 'asc' ? -1 : 1
      }

      if (aVal > bVal) {
        return direction === 'asc' ? 1 : -1
      }

      return 0
    })
  }

  /**
   * Returns a new array containing only unique values (removes duplicates).
   * Uses strict equality (`===`) for comparison.
   *
   * @example
   * ArrayUtil.unique([1, 2, 2, 3]) // [1, 2, 3]
   */
  static unique<T>(value: T[]): T[] {
    return [
      ...new Set(value),
    ]
  }
}
