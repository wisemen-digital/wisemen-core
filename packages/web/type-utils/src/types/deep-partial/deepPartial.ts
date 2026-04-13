/**
 * Recursively makes all properties of a type partial (optional) at all levels.
 * This is useful for creating update payloads or configuration objects where
 * any property at any depth could potentially be omitted.
 *
 * @example
 * ```typescript
 * interface User {
 *   id: string
 *   profile: {
 *     name: string
 *     address: {
 *       city: string
 *       zip: string
 *     }
 *   }
 * }
 *
 * type PartialUser = DeepPartial<User>
 * // Result: All properties at all levels become optional
 * ```
 */
export type DeepPartial<T> = T extends object
  ? {
      [K in keyof T]?: DeepPartial<T[K]>
    }
  : T
