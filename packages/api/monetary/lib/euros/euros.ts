import type { ApiPropertyOptions } from '@nestjs/swagger'
import { ApiProperty } from '@nestjs/swagger'
import { Monetary } from '../monetary.js'
import { MonetaryDto } from '../monetary.dto.js'
import { Currency } from '../currency.enum.js'
import { MonetaryObject } from '../monetary.object.js'
import { IsMonetary } from '../monetary.validator.js'
import { MonetaryAmountColumn, MonetaryAmountColumnOptions } from '../monetary-amount.column.js'

export class Euros extends Monetary {
  constructor (object: MonetaryObject<Currency.EUR>)
  constructor (amount: number, precision: number)
  constructor (objectOrAmount: MonetaryObject<Currency.EUR> | number, precision?: number) {
    if (typeof objectOrAmount === 'object') {
      super(objectOrAmount)
    } else {
      super(objectOrAmount, Currency.EUR, precision!)
    }
  }
}

export function EurosApiProperty (options?: ApiPropertyOptions): PropertyDecorator {
  return ApiProperty({
    type: MonetaryDto,
    description: `only accepts currency ${Currency.EUR}`,
    ...options
  })
}

export function IsEuros (maxPrecision?: number): PropertyDecorator {
  const allowedCurrencies = new Set<Currency>([Currency.EUR])
  return IsMonetary({ allowedCurrencies, maxPrecision })
}

export function EurosColumn (options: Omit<MonetaryAmountColumnOptions, 'currency'>): PropertyDecorator {
  return MonetaryAmountColumn({
    ...options,
    currency: Currency.EUR
  })
}
