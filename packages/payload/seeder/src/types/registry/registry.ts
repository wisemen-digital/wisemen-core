export interface SeedRegistry {}

type Resolve<K extends string, D> = K extends keyof SeedRegistry ? SeedRegistry[K] : D

export type RegistryCollections = Resolve<'collections', Record<string, string>>

export type RegistryCollectionSlug = keyof RegistryCollections & string

export type RegistryKey<C extends RegistryCollectionSlug> = RegistryCollections[C] & string

export type RegistryGlobal = Resolve<'globals', string>
