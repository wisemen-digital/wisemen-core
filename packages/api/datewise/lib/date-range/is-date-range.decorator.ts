import { applyDecorators } from '@nestjs/common'
import { IsObject, ValidateBy, ValidateNested, type ValidationArguments, ValidatorConstraint, type ValidatorConstraintInterface } from 'class-validator'
import { Type } from 'class-transformer'
import { PlainDate } from '../plain-date/plain-date.js'
import { DateRangeDto } from './date-range.dto.js'

export interface IsDateRangeValidationOptions {
  startsBefore?: () => PlainDate
  startsAfter?: () => PlainDate
  startsAfterOrOn?: () => PlainDate
  startsBeforeOrOn?: () => PlainDate
  endsBefore?: () => PlainDate
  endsBeforeOrOn?: () => PlainDate
  endsAfter?: () => PlainDate
  endsAfterOrOn?: () => PlainDate
  /** If set to true the date range dto cannot contain an infinite boundary, default false */
  finiteOnly?: boolean
  each?: boolean
}

export function IsDateRange (options?: IsDateRangeValidationOptions): PropertyDecorator {
  return applyDecorators(
    Type(() => DateRangeDto),
    ValidateNested({ each: options?.each }),
    IsObject(),
    ValidateBy({ name: 'isDateRange', validator: new IsDateRangeValidator(options) })
  )
}

@ValidatorConstraint({ name: 'isDateRange', async: false })
export class IsDateRangeValidator implements ValidatorConstraintInterface {
  private startsBefore?: () => PlainDate
  private startsAfter?: () => PlainDate
  private startsAfterOrOn?: () => PlainDate
  private startsBeforeOrOn?: () => PlainDate
  private endsBefore?: () => PlainDate
  private endsBeforeOrOn?: () => PlainDate
  private endsAfter?: () => PlainDate
  private endsAfterOrOn?: () => PlainDate
  private finiteOnly: boolean

  constructor (options?: IsDateRangeValidationOptions) {
    this.startsBefore = options?.startsBefore
    this.startsAfter = options?.startsAfter
    this.startsAfterOrOn = options?.startsAfterOrOn
    this.startsBeforeOrOn = options?.startsBeforeOrOn
    this.endsBefore = options?.endsBefore
    this.endsBeforeOrOn = options?.endsBeforeOrOn
    this.endsAfter = options?.endsAfter
    this.endsAfterOrOn = options?.endsAfterOrOn
    this.finiteOnly = options?.finiteOnly ?? false
  }

  validate (dateRange: unknown, _args: ValidationArguments): boolean {
    if (!(dateRange instanceof DateRangeDto)) {
      return false
    }

    try {
      const range = dateRange.parse()

      if (this.startsBefore !== undefined && !range.startsBefore(this.startsBefore())) {
        return false
      }

      if (this.startsAfter !== undefined && !range.startsAfter(this.startsAfter())) {
        return false
      }

      if (this.startsAfterOrOn !== undefined && !range.startsAfterOrOn(this.startsAfterOrOn())) {
        return false
      }

      if (this.startsBeforeOrOn !== undefined && !range.startsBeforeOrOn(this.startsBeforeOrOn())) {
        return false
      }

      if (this.endsBefore !== undefined && !range.endsBefore(this.endsBefore())) {
        return false
      }

      if (this.endsBeforeOrOn !== undefined && !range.endsBeforeOrOn(this.endsBeforeOrOn())) {
        return false
      }

      if (this.endsAfter !== undefined && !range.endsAfter(this.endsAfter())) {
        return false
      }

      if (this.endsAfterOrOn !== undefined && !range.endsAfterOrOn(this.endsAfterOrOn())) {
        return false
      }

      if (this.finiteOnly && !range.isFinite()) {
        return false
      }

      return true
    } catch {
      return false
    }
  }

  defaultMessage (args: ValidationArguments): string {
    let message = `${args.property} must be a valid date range`

    if (this.startsAfter !== undefined) {
      message += `\n\tthe range must start after ${this.startsAfter().toJSON()}`
    }

    if (this.startsAfterOrOn !== undefined) {
      message += `\n\tthe range must start after or on ${this.startsAfterOrOn().toJSON()}`
    }

    if (this.startsBefore !== undefined) {
      message += `\n\tthe range must start before ${this.startsBefore().toJSON()}`
    }

    if (this.startsBeforeOrOn !== undefined) {
      message += `\n\tthe range must start before or on ${this.startsBeforeOrOn().toJSON()}`
    }

    if (this.endsBefore !== undefined) {
      message += `\n\tthe range must end before ${this.endsBefore().toJSON()}`
    }

    if (this.endsBeforeOrOn !== undefined) {
      message += `\n\tthe range must end before or on ${this.endsBeforeOrOn().toJSON()}`
    }

    if (this.endsAfter !== undefined) {
      message += `\n\tthe range must end after ${this.endsAfter().toJSON()}`
    }

    if (this.endsAfterOrOn !== undefined) {
      message += `\n\tthe range must end after or on ${this.endsAfterOrOn().toJSON()}`
    }

    if (this.finiteOnly) {
      message += `\n\tthe range must be finite`
    }

    return message
  }
}
