import { applyDecorators } from '@nestjs/common'
import { IsObject, ValidateBy, ValidateNested, type ValidationArguments, ValidatorConstraint, type ValidatorConstraintInterface } from 'class-validator'
import { Type } from 'class-transformer'
import { DateTimeRangeDto } from './date-time-range.command.js'
import { Timestamp } from './timestamp.js'

export interface IsDateTimeRangeValidationOptions {
  startsAfter?: () => Timestamp
  endsBefore?: () => Timestamp
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
  private endsBefore?: () => Timestamp

  constructor (options?: IsDateTimeRangeValidationOptions) {
    this.startsAfter = options?.startsAfter
    this.endsBefore = options?.endsBefore
  }

  validate (dateRange: unknown, _args: ValidationArguments): boolean {
    if (!(dateRange instanceof DateTimeRangeDto)) {
      return false
    }

    try {
      const parsedRange = dateRange.parse()

      if (this.startsAfter !== undefined && !parsedRange.startsAfter(this.startsAfter())) {
        return false
      }

      if (this.endsBefore !== undefined && !parsedRange.endsBefore(this.endsBefore())) {
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
      message += `\n\tthe range must start after ${this.startsAfter().toString()}`
    }

    if (this.endsBefore !== undefined) {
      message += `\n\tthe range must end before ${this.endsBefore().toString()}`
    }

    return message
  }
}
