/**
 * Recursively makes all keys/properties of a type nullable (can be null) at all levels.
 * This is useful for representing partial data structures where any property at any depth
 * could potentially be null, such as database records with optional columns or API responses.
 *
 * @example
 * ```typescript
 * interface User {
 *   id: string
 *   profile: {
 *     name: string
 *     age: number
 *   }
 * }
 *
 * type NullableUser = NullableNestedKeys<User>
 * // Result: All properties at all levels become nullable (Type | null)
 * ```
 */
export type DeepNullable<T> = T extends object
  ? {
      [K in keyof T]: DeepNullable<T[K]> | null
    }
  : T
