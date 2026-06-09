export type SortDirection = 'asc' | 'desc'

export interface Sort<TKey extends string = string> {
  direction: SortDirection
  key: TKey
}
