export type Relation<T> = T & { readonly _relation?: true }

export type IsRelation<K>
  = [Extract<K, { readonly _relation?: true }>] extends [never]
    ? false
    : true
