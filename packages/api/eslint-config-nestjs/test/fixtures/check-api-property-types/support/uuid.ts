export type Uuid<Brand extends string> = string
  & { readonly __brand: 'uuid' }
  & { readonly __uuid: Brand }
