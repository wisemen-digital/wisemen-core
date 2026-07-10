/* eslint-disable @typescript-eslint/naming-convention */
export type Uuid<Brand extends string> = string
  & { readonly __brand: 'uuid' }
  & { readonly __uuid: Brand }

export function generateUuid<Brand extends Uuid<string> | null>(): Exclude<Brand, null> {
  return crypto.randomUUID() as Exclude<Brand, null>
}

export type CustomFieldDefinitionUuid = Uuid<'CustomFieldDefinition'>