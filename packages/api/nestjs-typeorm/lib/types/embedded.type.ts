export type Embedded<T> = T & { readonly _embedded?: true }

export type IsEmbedded<K>
  = [Extract<K, { readonly _embedded?: true }>] extends [never]
    ? false
    : true
