import { applyDecorators } from '@nestjs/common'
import { IsObject, ValidateBy, ValidateNested, type ValidationArguments, ValidatorConstraint, type ValidatorConstraintInterface } from 'class-validator'
import { Type } from 'class-transformer'
import { WiseDate } from '@wisemen/wise-date'
import { DateRangeDto } from './date-range.dto.js'

export interface IsDateRangeValidationOptions {
  startsBefore?: () => WiseDate
  startsAfter?: () => WiseDate
  endsBefore?: () => WiseDate
  endsAfter?: () => WiseDate
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
  private startsBefore?: () => WiseDate
  private startsAfter?: () => WiseDate
  private endsBefore?: () => WiseDate
  private endsAfter?: () => WiseDate

  constructor (options?: IsDateRangeValidationOptions) {
    this.startsBefore = options?.startsBefore
    this.startsAfter = options?.startsAfter
    this.endsBefore = options?.endsBefore
    this.endsAfter = options?.endsAfter
  }

  validate (dateRange: unknown, _args: ValidationArguments): boolean {
    if (!(dateRange instanceof DateRangeDto)) {
      return false
    }

    try {
      const parsedRange = dateRange.parse()

      if (this.startsBefore !== undefined && !parsedRange.startsBefore(this.startsBefore())) {
        return false
      }

      if (this.startsAfter !== undefined && !parsedRange.startsAfter(this.startsAfter())) {
        return false
      }

      if (this.endsBefore !== undefined && !parsedRange.endsBefore(this.endsBefore())) {
        return false
      }

      if (this.endsAfter !== undefined && !parsedRange.endsAfter(this.endsAfter())) {
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
