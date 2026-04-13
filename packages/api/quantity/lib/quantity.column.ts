import { Column, ColumnOptions, ValueTransformer } from 'typeorm'
import { Quantity, QuantityConstructor } from './quantity.js'

export type QuantityColumnOptions<U extends string, Q extends Quantity<U, Q>>
  = Omit<ColumnOptions, 'type' | 'transformer' | 'default'> & { default?: Q }

export function QuantityColumn<U extends string, Q extends Quantity<U, Q>> (
  QuantityConstructor: QuantityConstructor<U, Q>,
  storeAsUnit: U,
  options?: QuantityColumnOptions<U, Q>
): PropertyDecorator {
  const transformer = new QuantityTypeOrmTransformer(QuantityConstructor, storeAsUnit)

  return Column({
    ...options,
    default: transformer.to(options?.default),
    type: 'float',
    transformer
  })
}

export class QuantityTypeOrmTransformer<U extends string, Q extends Quantity<U, Q>>
implements ValueTransformer {
  constructor (
    private readonly QuantityConstructor: QuantityConstructor<U, Q>,
    private readonly storedUnit: U
  ) {}

  from (value: number): Q
  from (value: number | null): Q | null
  from (value: number | null): Q | null {
    if (value === null) {
      return null
    }

    return new this.QuantityConstructor(value, this.storedUnit)
  }

  to (quantity: Q): number
  to (quantity: Q | null): number | null
  to (quantity: Q | null | undefined): number | null | undefined
  to (quantity: Q | null | undefined): number | null | undefined {
    if (quantity === undefined || quantity === null) {
      return quantity
    }

    return quantity.asNumber(this.storedUnit)
  }
}
