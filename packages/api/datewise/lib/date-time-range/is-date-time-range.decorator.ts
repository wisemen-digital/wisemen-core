import { applyDecorators } from '@nestjs/common'
import { IsObject, ValidateBy, ValidateNested, type ValidationArguments, ValidatorConstraint, type ValidatorConstraintInterface } from 'class-validator'
import { Type } from 'class-transformer'
import { Timestamp } from '../timestamp/timestamp.js'
import { DateTimeRangeDto } from './date-time-range.dto.js'

export interface IsDateTimeRangeValidationOptions {
  startsAfter?: () => Timestamp
  startsAfterOrAt?: () => Timestamp
  startsBefore?: () => Timestamp
  startsBeforeOrAt?: () => Timestamp
  endsBefore?: () => Timestamp
  endsBeforeOrAt?: () => Timestamp
  endsAfter?: () => Timestamp
  endsAfterOrAt?: () => Timestamp
  /** If set to true the date time range dto cannot contain an infinite boundary, default false */
  finiteOnly?: boolean
  each?: boolean
}

export function IsDateTimeRange (options?: IsDateTimeRangeValidationOptions): PropertyDecorator {
  return applyDecorators(
    Type(() => DateTimeRangeDto),
    ValidateNested({ each: options?.each }),
    IsObject(),
    ValidateBy({ name: 'isDateTimeRange', validator: new IsDateTimeRangeValidator(options) })
  )
}

@ValidatorConstraint({ name: 'isDateRange', async: false })
export class IsDateTimeRangeValidator implements ValidatorConstraintInterface {
  private startsAfter?: () => Timestamp
  private startsAfterOrAt?: () => Timestamp
  private startsBefore?: () => Timestamp
  private startsBeforeOrAt?: () => Timestamp
  private endsBefore?: () => Timestamp
  private endsBeforeOrAt?: () => Timestamp
  private endsAfter?: () => Timestamp
  private endsAfterOrAt?: () => Timestamp
  private finiteOnly: boolean

  constructor (options?: IsDateTimeRangeValidationOptions) {
    this.startsAfter = options?.startsAfter
    this.startsAfterOrAt = options?.startsAfterOrAt
    this.startsBefore = options?.startsBefore
    this.startsBeforeOrAt = options?.startsBeforeOrAt
    this.endsBefore = options?.endsBefore
    this.endsBeforeOrAt = options?.endsBeforeOrAt
    this.endsAfter = options?.endsAfter
    this.endsAfterOrAt = options?.endsAfterOrAt
    this.finiteOnly = options?.finiteOnly ?? false
  }

  validate (dateRange: unknown, _args: ValidationArguments): boolean {
    if (!(dateRange instanceof DateTimeRangeDto)) {
      return false
    }

    try {
      const range = dateRange.parse()

      if (this.startsAfter !== undefined && !range.startsAfter(this.startsAfter())) {
        return false
      }

      if (this.startsAfterOrAt !== undefined && !range.startsAfterOrAt(this.startsAfterOrAt())) {
        return false
      }

      if (this.startsBefore !== undefined && !range.startsBefore(this.startsBefore())) {
        return false
      }

      if (this.startsBeforeOrAt !== undefined && !range.startsBeforeOrAt(this.startsBeforeOrAt())) {
        return false
      }

      if (this.endsBefore !== undefined && !range.endsBeforeOrAt(this.endsBefore())) {
        return false
      }

      if (this.endsBeforeOrAt !== undefined && !range.endsBeforeOrAt(this.endsBeforeOrAt())) {
        return false
      }

      if (this.endsAfter !== undefined && !range.endsAfter(this.endsAfter())) {
        return false
      }

      if (this.endsAfterOrAt !== undefined && !range.endsAfterOrAt(this.endsAfterOrAt())) {
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
      message += `\n\tthe range must start after ${this.startsAfter().toISOString()}`
    }

    if (this.startsAfterOrAt !== undefined) {
      message += `\n\tthe range must start after or at ${this.startsAfterOrAt().toISOString()}`
    }

    if (this.startsBefore !== undefined) {
      message += `\n\tthe range must start before ${this.startsBefore().toISOString()}`
    }

    if (this.startsBeforeOrAt !== undefined) {
      message += `\n\tthe range must start before or at ${this.startsBeforeOrAt().toISOString()}`
    }

    if (this.endsBefore !== undefined) {
      message += `\n\tthe range must end before or at ${this.endsBefore().toISOString()}`
    }

    if (this.endsBeforeOrAt !== undefined) {
      message += `\n\tthe range must end before or at ${this.endsBeforeOrAt().toISOString()}`
    }

    if (this.endsAfter !== undefined) {
      message += `\n\tthe range must end after ${this.endsAfter().toISOString()}`
    }

    if (this.endsAfterOrAt !== undefined) {
      message += `\n\tthe range must end after or at ${this.endsAfterOrAt().toISOString()}`
    }

    if (this.finiteOnly) {
      message += `\n\tthe range must be finite`
    }

    return message
  }
}
