export interface CustomViewStateAdapter<TKey extends string, T> {
  isDirty: (saved: T, current: T) => boolean
  apply: (state: T) => void
  deserialize: (raw: unknown) => T
  getCurrentState: () => T
  key: TKey
  serialize: (value: T) => unknown
}

export function createCustomViewStateAdapter<
  const TKey extends string,
  TState,
>(adapter: CustomViewStateAdapter<TKey, TState>): CustomViewStateAdapter<TKey, TState> {
  return adapter
}

export type AdaptersToState<TAdapters extends CustomViewStateAdapter<string, any>[]> = {
  [A in TAdapters[number] as A['key']]: A extends CustomViewStateAdapter<A['key'], infer TValue> ? TValue : never
}
