export type Default<T> = T & { readonly _default?: true }

export type HasDefault<K>
  = [Extract<K, { readonly _default?: true }>] extends [never]
    ? false
    : true
