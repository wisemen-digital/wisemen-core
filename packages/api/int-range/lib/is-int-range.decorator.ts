import { applyDecorators } from '@nestjs/common'
import { IsObject, ValidateBy, ValidateNested, type ValidationArguments, ValidatorConstraint, type ValidatorConstraintInterface } from 'class-validator'
import { Type } from 'class-transformer'
import { IntRangeDto } from './int-range.command.js'

export interface IsIntRangeValidationOptions {
  startsAfter?: () => number
  endsBefore?: () => number
  each?: boolean
}

export function IsIntRange (options?: IsIntRangeValidationOptions): PropertyDecorator {
  return applyDecorators(
    Type(() => IntRangeDto),
    ValidateNested({ each: options?.each }),
    IsObject(),
    ValidateBy({ name: 'isIntRange', validator: new IsIntRangeValidator(options) })
  )
}

@ValidatorConstraint({ name: 'isIntRange', async: false })
export class IsIntRangeValidator implements ValidatorConstraintInterface {
  private startsAfter?: () => number
  private endsBefore?: () => number

  constructor (options?: IsIntRangeValidationOptions) {
    this.startsAfter = options?.startsAfter
    this.endsBefore = options?.endsBefore
  }

  validate (intRange: unknown, _args: ValidationArguments): boolean {
    if (!(intRange instanceof IntRangeDto)) {
      return false
    }

    try {
      const parsedRange = intRange.parse()

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
    let message = `${args.property} must be a valid int range`

    if (this.startsAfter !== undefined) {
      message += `\n\tthe range must start after ${this.startsAfter()}`
    }

    if (this.endsBefore !== undefined) {
      message += `\n\tthe range must end before ${this.endsBefore()}`
    }

    return message
  }
}
