export type Uuid<Brand extends string> = string
  & { readonly _brand: 'uuid' }
  & { readonly _uuid: Brand }
  
export type FeatureFlagUuid = Uuid<'FeatureFlag'>
