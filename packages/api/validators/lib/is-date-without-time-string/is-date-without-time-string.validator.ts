import type {
  ValidationOptions,
  ValidatorConstraintInterface, ValidationArguments
} from 'class-validator'
import {
  Validate,
  ValidatorConstraint
} from 'class-validator'
import dayjs from 'dayjs'

interface IsDateWithoutTimeStringOptions extends ValidationOptions {
  allowInfinity?: boolean
}

type IsDateWithoutTimeStringConstraints = [{ allowInfinity?: boolean }]

/**
   * Validate that the value is a string with format hh:mm:ss
   */
export function IsDateWithoutTimeString (
  validationOptions?: IsDateWithoutTimeStringOptions
): PropertyDecorator {
  const constraints = [
    { allowInfinity: validationOptions?.allowInfinity }
  ]

  return Validate(IsDateWithoutTimeStringValidator, constraints, validationOptions)
}

@ValidatorConstraint({ name: 'isDateWithoutTimeString', async: false })
export class IsDateWithoutTimeStringValidator implements ValidatorConstraintInterface {
  validate (dateString: unknown, args: ValidationArguments): boolean {
    if (typeof dateString !== 'string') return false

    const constraints = args.constraints as IsDateWithoutTimeStringConstraints

    if (
      (constraints[0].allowInfinity === true)
      && (dateString === 'infinity' || dateString === '-infinity' || dateString === '+infinity')
    ) {
      return true
    }

    const regex = /^\d{4}-\d{2}-\d{2}$/

    if (!regex.test(dateString)) return false

    return dayjs(dateString, 'YYYY-MM-DD').isValid()
  }

  defaultMessage (args: ValidationArguments): string {
    const constraints = args.constraints as IsDateWithoutTimeStringConstraints
    let message = `${args.property} must be a date string of format YYYY-MM-DD`

    if (constraints[0].allowInfinity === true) {
      message += ', infinity, +infinity or -infinity'
    }

    return message
  }
}
