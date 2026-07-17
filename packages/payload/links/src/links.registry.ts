import type { PayloadUtilsRegistry } from '@wisemen/payload-core-utils'

type RegisteredLinkableCollection = PayloadUtilsRegistry extends {
  linkableCollection: infer TValue extends string
}
  ? TValue
  : never

type RegisteredNavigationEvent = PayloadUtilsRegistry extends {
  navigationEvent: infer TValue extends string
}
  ? TValue
  : never

export type LinkableCollectionSlug = RegisteredLinkableCollection
export type NavigationLinkEventValue = RegisteredNavigationEvent
export type NonEmptyReadonlyArray<T> = readonly [T, ...T[]]

export function toNonEmptyReadonlyArray<T>(value: readonly T[]): NonEmptyReadonlyArray<T> | undefined {
  if (value.length === 0) {
    return undefined
  }

  return value as NonEmptyReadonlyArray<T>
}
