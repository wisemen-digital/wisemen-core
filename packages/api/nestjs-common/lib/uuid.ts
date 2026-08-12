export type Uuid<Brand extends string> = string
  & { readonly _brand: 'uuid' }
  & { readonly _uuid: Brand }

export function generateUuid<Brand extends Uuid<string> | null> (): Exclude<Brand, null> {
  return crypto.randomUUID() as Exclude<Brand, null>
}
