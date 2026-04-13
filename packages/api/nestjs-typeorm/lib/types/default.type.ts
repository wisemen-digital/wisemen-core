export type Default<T> = T & { readonly __default?: true }

export type HasDefault<K>
  = [Extract<K, { readonly __default?: true }>] extends [never]
    ? false
    : true
