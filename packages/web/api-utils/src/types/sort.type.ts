export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export interface Sort<TKey extends string = string> {
  direction: SortDirection
  key: TKey
}
