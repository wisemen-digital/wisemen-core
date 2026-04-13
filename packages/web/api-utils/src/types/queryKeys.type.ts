import type { Ref } from 'vue'

/**
 * Generic helper types for libraries/factories that want to infer query key typing
 * from a user-provided config object (instead of relying on module augmentation).
 */

/**
 * Extract the entity type from a query-keys config for a specific key.
 */
export type QueryKeyEntityFromConfig<
  TQueryKeys extends object,
  TKey extends PropertyKey,
> = TKey extends keyof TQueryKeys
  ? TQueryKeys[TKey] extends { entity: infer E }
    ? E
    : never
  : never

/**
 * Extract the params type from a query-keys config for a specific key.
 * Automatically wraps each param in Ref for reactivity.
 */
export type QueryKeyParamsFromConfig<
  TQueryKeys extends object,
  TKey extends PropertyKey,
> = TKey extends keyof TQueryKeys
  ? TQueryKeys[TKey] extends { params: infer P }
    ? {
        [K in keyof P]: Ref<P[K]>
      }
    : void
  : never
/**
 * Extract the raw params type from a query-keys config for a specific key (unwrapped from Computed).
 * Used for optimistic updates which accept plain values.
 */
export type QueryKeyRawParamsFromConfig<
  TQueryKeys extends object,
  TKey extends PropertyKey,
> = TKey extends keyof TQueryKeys
  ? TQueryKeys[TKey] extends { params: infer P }
    ? P
    : void
  : never
/**
 * Get all keys that have an associated entity in a query-keys config.
 */
export type QueryKeysWithEntityFromConfig<TQueryKeys extends object> = (
  {
    [K in keyof TQueryKeys]: TQueryKeys[K] extends { entity: any }
      ? K
      : never
  }[keyof TQueryKeys]
) & string
