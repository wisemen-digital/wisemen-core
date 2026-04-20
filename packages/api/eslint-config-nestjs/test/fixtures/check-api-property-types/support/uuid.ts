/* eslint-disable @typescript-eslint/naming-convention */
export type Uuid<Brand extends string> = string & 
(
  ({ readonly __brand: 'uuid' }
    & { readonly __uuid: Brand }) 
| ({ readonly _brand: 'uuid' } 
  & { readonly _uuid: Brand })
)
