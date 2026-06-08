import type {
  Sort,
  SortDirection,
} from '@/types/sort.type'

export class SortUtil {
  static toDto<SortKey extends string, QueryKey>(
    sort: Sort<SortKey>[],
    sortKeyMap: Record<SortKey, QueryKey>,
  ): {
    key: QueryKey
    order: SortDirection
  }[] {
    return sort
      .filter((s) => s.direction !== null)
      .map((s) => ({
        key: sortKeyMap[s.key],
        order: s.direction === 'asc' ? 'asc' : 'desc',
      }))
  }
}
