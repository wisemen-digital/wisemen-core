import { Column, ColumnOptions, ValueTransformer } from 'typeorm'
import { Rate } from './rate.js'

export type RateColumnOptions
  = Omit<ColumnOptions, 'type' | 'transformer' | 'default'> & { default?: Rate }

export function RateColumn (
  options?: RateColumnOptions
): PropertyDecorator {
  const transformer = new RateTypeOrmTransformer()

  return Column({
    ...options,
    default: transformer.to(options?.default),
    type: 'float',
    transformer
  })
}

export class RateTypeOrmTransformer implements ValueTransformer {
  constructor () {}

  from (value: number): Rate
  from (value: number | null): Rate | null
  from (value: number | null): Rate | null {
    if (value === null) {
      return null
    }

    return Rate.fromDecimal(value)
  }

  to (rate: Rate): number
  to (rate: Rate | null): number | null
  to (rate: Rate | null | undefined): number | null | undefined
  to (rate: Rate | null | undefined): number | null | undefined {
    if (rate === undefined || rate === null) {
      return rate
    }

    return rate.asDecimal()
  }
}
