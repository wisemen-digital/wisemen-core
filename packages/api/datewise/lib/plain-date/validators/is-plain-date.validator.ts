import type { ValidatorConstraintInterface, ValidationArguments, ValidationOptions } from 'class-validator'
import { Validate, ValidatorConstraint } from 'class-validator'
import { plainDate } from '../index.js'

/** Validate that the value is a string of format YYYY-MM-DD or (+-)infinity */
export function IsPlainDate (validationOptions?: ValidationOptions): PropertyDecorator {
  return Validate(IsPlainDateValidator, [], validationOptions)
}

@ValidatorConstraint({ name: 'isPlainDate', async: false })
export class IsPlainDateValidator implements ValidatorConstraintInterface {
  validate (dateValue: unknown): boolean {
    if (typeof dateValue !== 'string') {
      return false
    }

    try {
      plainDate(dateValue)

      return true
    } catch {
      return false
    }
  }

  defaultMessage (args: ValidationArguments): string {
    return `${args.property} must be a date string of format YYYY-MM-DD, infinity, +infinity or -infinity'`
  }
}
