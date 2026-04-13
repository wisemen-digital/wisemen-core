import { Column, ColumnOptions } from 'typeorm'
import { LocalizedString, LocalizedValue } from './localized-string.js'

export function LocalizedStringColumn (
  options?: Omit<ColumnOptions, 'type' | 'transformer'>
): PropertyDecorator {
  return Column({
    type: 'jsonb',
    transformer: LocalizedStringTransformer.getInstance(),
    ...options
  })
}

export class LocalizedStringTransformer {
  private static instance: LocalizedStringTransformer | undefined

  public static getInstance (): LocalizedStringTransformer {
    LocalizedStringTransformer.instance ??= new LocalizedStringTransformer()

    return LocalizedStringTransformer.instance
  }

  private constructor () {}

  from (value: LocalizedValue[] | null): LocalizedString | null {
    if (value === null) {
      return null
    }

    return new LocalizedString(value)
  }

  to (value: LocalizedString | null | undefined): LocalizedValue[] | null | undefined {
    if (value == null) {
      return value
    }

    return value.toJSON()
  }
}
