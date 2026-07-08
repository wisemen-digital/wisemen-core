import { HasDefault } from './default.type.js'
import { IsEmbedded } from './embedded.type.js'
import { IsRelation } from './relation.js'

type OptionalKeys<T> = {
  [K in keyof T]: null extends T[K]
    ? K
    : HasDefault<T[K]> extends true
      ? K
      : never
}[keyof T]

type RelationKeys<T> = {
  [K in keyof T]: IsRelation<T[K]> extends true
    ? K
    : never
}[keyof T]

type RequiredKeys<T> = Exclude<keyof T, OptionalKeys<T> | RelationKeys<T>>

export type EntityInsert<T>
  = { 
      [K in RequiredKeys<T>]: 
        IsEmbedded<T[K]> extends true 
          ? EntityInsert<Omit<T[K], '_embedded'>> 
          : T[K] 
    } // required properties
  & { 
      [K in OptionalKeys<T>]?: 
        IsEmbedded<T[K]> extends true 
          ? EntityInsert<Omit<T[K], '_embedded'>> 
          : T[K] 
    } // optional properties
