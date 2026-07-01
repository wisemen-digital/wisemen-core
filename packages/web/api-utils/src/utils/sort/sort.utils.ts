import type { Sort } from '@/types/sort.type'

enum SortDirectionDto {
  ASC = 'asc',
  DESC = 'desc',
}

export class SortUtil {
  static toDto<SortKey extends string, QueryKey>(
    sort: Sort<SortKey>[],
    sortKeyMap: Record<SortKey, QueryKey>,
  ): {
    key: QueryKey
    // Return any instead of SortDirectionDto since enums cannot be compared
    order: any
  }[] {
    return sort
      .filter((s) => s.direction !== null)
      .map((s) => ({
        key: sortKeyMap[s.key],
        order: (s.direction === 'asc' ? SortDirectionDto.ASC : SortDirectionDto.DESC),
      }))
  }
}
