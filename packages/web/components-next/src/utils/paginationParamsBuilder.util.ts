import type {
  BasePagination,
  PaginationOptions,
} from '@/composables'

const DEFAULT_OFFSET = 0
const DEFAULT_LIMIT = 20

enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

type PaginationParamsSet = {
  key?: unknown
  limit: number
} | {
  limit: number
  offset: number
}

interface PaginationSort<TSortKeys> {
  key: TSortKeys
  order: SortDirection
}

interface PaginationParams<TPagination extends BasePagination> {
  filter: TPagination['filter']
  pagination: PaginationParamsSet
  search?: string
  sort: PaginationSort<TPagination['sort']>[]
}

export interface PaginationOffsetParams<TPagination extends BasePagination> extends PaginationParams<TPagination> {
  pagination: {
    limit: number
    offset: number
  }
}

export interface PaginationKeysetParams<TPagination extends BasePagination> extends PaginationParams<TPagination> {
  pagination: {
    key?: never
    limit: number
  }
}

export class PaginationParamsBuilder<TPagination extends BasePagination> {
  private params: PaginationParams<TPagination>

  constructor(paginationOptions?: PaginationOptions<TPagination>) {
    const allFilters = {
      ...paginationOptions?.filter,
      ...paginationOptions?.staticFilters,
    }

    const pagination = this.getPaginationSet(paginationOptions)

    this.params = {
      pagination,
      search: paginationOptions?.search,
    } as PaginationParams<TPagination>

    for (const [
      key,
      value,
    ] of Object.entries(allFilters)) {
      this.withFilter(key as keyof TPagination['filter'], value as TPagination['filter'][keyof TPagination['filter']])
    }

    if (paginationOptions?.sort !== undefined) {
      this.withSort({
        key: paginationOptions.sort.key as TPagination['sort'],
        order: paginationOptions.sort.order as SortDirection,
      })
    }
  }

  private getPaginationSet(paginationOptions?: PaginationOptions<TPagination>): PaginationParamsSet {
    const limit = (paginationOptions?.pagination.limit ?? DEFAULT_LIMIT)

    if (paginationOptions === undefined) {
      return {
        limit,
        offset: DEFAULT_OFFSET,
      }
    }

    return paginationOptions?.pagination?.type === 'offset'
      ? {
          limit,
          offset: (paginationOptions?.pagination.offset ?? DEFAULT_OFFSET),
        }
      : {
          key: paginationOptions?.pagination.key,
          limit,
        }
  }

  public build<TPaginationDto extends BasePagination>(
    transformer?: (value: TPagination) => TPaginationDto,
  ): PaginationOffsetParams<TPaginationDto> {
    const pagination = this.params.pagination

    return {
      ...this.params,
      filter: transformer?.(this.params as never).filter as TPaginationDto['filter'],
      pagination: {
        limit: pagination.limit,
        offset: 'offset' in pagination ? pagination.offset : DEFAULT_OFFSET,
      },
      sort: (this.params?.sort?.map((sort) => ({
        key: sort.key,
        order: sort.order,
      })) ?? []) as unknown as PaginationSort<TPaginationDto['sort']>[],
    }
  }

  public buildKeyset<TPaginationDto extends BasePagination>(
    transformer?: (value: TPagination) => TPaginationDto,
  ): PaginationKeysetParams<TPaginationDto> {
    return {
      ...this.params,
      filter: transformer?.(this.params as never).filter as TPaginationDto['filter'],
      pagination: {
        key: (this.params.pagination as any).key,
        limit: this.params.pagination?.limit,
      },
      sort: (this.params?.sort?.map((sort) => ({
        key: sort.key,
        order: sort.order,
      })) ?? []) as unknown as PaginationSort<TPaginationDto['sort']>[],
    }
  }

  public withFilter<TKey extends keyof TPagination['filter']>(
    key: TKey,
    value: TPagination['filter'][TKey] | null | undefined,
  ): PaginationParamsBuilder<TPagination> {
    if (value !== null && value !== '') {
      this.params.filter = {
        ...this.params.filter,
        [key]: value,
      } as TPagination['filter']
    }

    return this
  }

  public withKey(key: unknown | null): PaginationParamsBuilder<TPagination> {
    if ('offset' in this.params.pagination) {
      throw new Error('Cannot set key when using offset pagination')
    }

    this.params.pagination.key = key

    return this
  }

  public withLimit(limit: number): PaginationParamsBuilder<TPagination> {
    this.params.pagination.limit = limit

    return this
  }

  public withOffset(offset: number): PaginationParamsBuilder<TPagination> {
    if ('key' in this.params.pagination) {
      throw new Error('Cannot set offset when using keyset pagination')
    }

    if ('offset' in this.params.pagination) {
      this.params.pagination.offset = offset
    }

    return this
  }

  public withSearch(search: string): PaginationParamsBuilder<TPagination> {
    this.params.search = search

    return this
  }

  public withSort(sort: PaginationSort<TPagination['sort']>): PaginationParamsBuilder<TPagination> {
    this.params.sort = [
      {
        key: sort.key as TPagination['sort'],
        order: sort.order,
      },
    ]

    return this
  }
}
