import { HasDefault } from './default.type.js'

type OptionalKeys<T> = {
  [K in keyof T]:
  null extends T[K]
    ? K
    : HasDefault<T[K]> extends true
      ? K
      : never
}[keyof T]

type RequiredKeys<T> = Exclude<keyof T, OptionalKeys<T>>

export type Insert<T>
  // required properties
  = { [K in RequiredKeys<T>]: T[K] }
  // optional properties
    & { [K in OptionalKeys<T>]?: T[K] }
