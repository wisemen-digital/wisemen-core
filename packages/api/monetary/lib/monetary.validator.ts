import { IsObject, ValidateBy, ValidateNested, ValidatorConstraintInterface } from 'class-validator'
import { applyDecorators } from '@nestjs/common'
import { ValidationArguments } from 'class-validator/types/validation/ValidationArguments.js'
import { Type } from 'class-transformer'
import { Currency } from './currency.enum.js'
import { MonetaryDto } from './monetary.dto.js'
import { Monetary } from './monetary.js'

export interface IsMonetaryOptions {
  maxPrecision?: number
  allowedCurrencies?: Set<Currency>
  min?: Monetary
  max?: Monetary
}

export function IsMonetary (options?: IsMonetaryOptions): PropertyDecorator {
  return applyDecorators(
    IsObject(),
    ValidateNested(),
    Type(() => MonetaryDto),
    ValidateBy({
      name: 'IsMonetaryCurrency',
      validator: new IsMonetaryCurrencyValidator(options?.allowedCurrencies)
    }),
    ValidateBy({
      name: 'IsMonetaryPrecision',
      validator: new IsMonetaryPrecisionValidator(options?.maxPrecision ?? Infinity)
    }),
    ValidateBy({
      name: 'IsMonetaryMin',
      validator: new IsMonetaryMinValidator(options?.min)
    }),
    ValidateBy({
      name: 'IsMonetaryMax',
      validator: new IsMonetaryMaxValidator(options?.max)
    })
  )
}

function isComparableMonetaryDto (value: MonetaryDto<Currency> | null | undefined): value is MonetaryDto<Currency> {
  if (value == null) {
    return false
  }

  return Number.isInteger(value.amount)
    && typeof value.currency === 'string'
    && Number.isInteger(value.precision)
}

class IsMonetaryCurrencyValidator implements ValidatorConstraintInterface {
  constructor (
    private allowedCurrencies?: Set<Currency>
  ) {}

  validate (monetaryDto: MonetaryDto<Currency> | null | undefined): boolean {
    if (monetaryDto == null) {
      return false
    }

    return this.allowedCurrencies === undefined
      || this.allowedCurrencies.has(monetaryDto.currency)
  }

  defaultMessage (validationArguments?: ValidationArguments): string {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return `Monetary currency ${validationArguments?.value?.currency} is not allowed`
  }
}

class IsMonetaryPrecisionValidator implements ValidatorConstraintInterface {
  constructor (
    private maxPrecision: number
  ) {}

  validate (monetaryDto: MonetaryDto<Currency> | null | undefined): boolean {
    if (monetaryDto == null) {
      return false
    }

    return monetaryDto.precision <= this.maxPrecision
  }

  defaultMessage (validationArguments?: ValidationArguments): string {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return `Monetary precision ${validationArguments?.value?.precision} must be <= ${this.maxPrecision}`
  }
}
class IsMonetaryMinValidator implements ValidatorConstraintInterface {
  constructor (
    private min?: Monetary
  ) {}

  validate (monetaryDto: MonetaryDto<Currency> | null | undefined): boolean {
    if (monetaryDto == null) {
      return false
    }
    if (this.min === undefined) {
      return true
    }
    if (!isComparableMonetaryDto(monetaryDto)) {
      return true
    }

    return new Monetary(monetaryDto) >= this.min
  }

  defaultMessage (validationArguments?: ValidationArguments): string {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    if (!isComparableMonetaryDto(validationArguments?.value)) {
      return `Monetary amount must be >= ${this.min?.toString()}`
    }
     
    const monetary = new Monetary(validationArguments?.value)
    return `Monetary ${monetary.toString()} must be >= ${this.min?.toString()}`
  }
}

class IsMonetaryMaxValidator implements ValidatorConstraintInterface {
  constructor (
    private max?: Monetary
  ) {}

  validate (monetaryDto: MonetaryDto<Currency> | null | undefined): boolean {
    if (monetaryDto == null) {
      return false
    }
    if (this.max === undefined) {
      return true
    }
    if (!isComparableMonetaryDto(monetaryDto)) {
      return true
    }

    return new Monetary(monetaryDto) <= this.max
  }

  defaultMessage (validationArguments?: ValidationArguments): string {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    if (!isComparableMonetaryDto(validationArguments?.value)) {
      return `Monetary amount must be <= ${this.max?.toString()}`
    }
     
    const monetary = new Monetary(validationArguments?.value)
    return `Monetary ${monetary.toString()} must be <= ${this.max?.toString()}`
  }
}
