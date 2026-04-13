import type { ValidatorConstraintInterface, ValidationArguments, ValidationOptions } from 'class-validator'
import { Validate, ValidatorConstraint } from 'class-validator'
import { timestamp } from '../index.js'

export interface IsTimestampValidationOptions extends ValidationOptions {
  isAfter?: (dto: object) => string | null | undefined
  isBefore?: (dto: object) => string | null | undefined
  isSameOrAfter?: (dto: object) => string | null | undefined
  isSameOrBefore?: (dto: object) => string | null | undefined
}

/** Validate that the value is a string of format YYYY-MM-DD or (+-)infinity */
export function IsTimestamp (validationOptions?: IsTimestampValidationOptions): PropertyDecorator {
  return Validate(
    IsTimestampValidator,
    [{
      isAfter: validationOptions?.isAfter,
      isBefore: validationOptions?.isBefore,
      isSameOrAfter: validationOptions?.isSameOrAfter,
      isSameOrBefore: validationOptions?.isSameOrBefore
    }],
    validationOptions
  )
}

interface ValidatorConstraints {
  isAfter?: (dto: object) => string | null | undefined
  isBefore?: (dto: object) => string | null | undefined
  isSameOrAfter?: (dto: object) => string | null | undefined
  isSameOrBefore?: (dto: object) => string | null | undefined
}

@ValidatorConstraint({ name: 'isTimestamp', async: false })
export class IsTimestampValidator implements ValidatorConstraintInterface {
  validate (dateValue: unknown, args: ValidationArguments): boolean {
    if (typeof dateValue !== 'string') {
      return false
    }

    try {
      const currentTimestamp = timestamp(dateValue)

      if (!currentTimestamp.isValid()) {
        return false
      }

      const constraints = args.constraints[0] as ValidatorConstraints

      if (constraints.isAfter != null) {
        const compareValue = constraints.isAfter(args.object)

        if (compareValue != null) {
          const compareTimestamp = timestamp(compareValue)

          if (!currentTimestamp.isAfter(compareTimestamp)) {
            return false
          }
        }
      }

      if (constraints.isBefore != null) {
        const compareValue = constraints.isBefore(args.object)

        if (compareValue != null) {
          const compareTimestamp = timestamp(compareValue)

          if (!currentTimestamp.isBefore(compareTimestamp)) {
            return false
          }
        }
      }

      if (constraints.isSameOrAfter != null) {
        const compareValue = constraints.isSameOrAfter(args.object)

        if (compareValue != null) {
          const compareTimestamp = timestamp(compareValue)

          if (!currentTimestamp.isSameOrAfter(compareTimestamp)) {
            return false
          }
        }
      }

      if (constraints.isSameOrBefore != null) {
        const compareValue = constraints.isSameOrBefore(args.object)

        if (compareValue != null) {
          const compareTimestamp = timestamp(compareValue)

          if (!currentTimestamp.isSameOrBefore(compareTimestamp)) {
            return false
          }
        }
      }

      return true
    } catch {
      return false
    }
  }

  defaultMessage (args: ValidationArguments): string {
    const constraints = args.constraints[0] as ValidatorConstraints

    if (constraints.isAfter != null) {
      const compareValue = constraints.isAfter(args.object)

      if (compareValue != null) {
        return `${args.property} must be after ${compareValue}`
      }
    }

    if (constraints.isBefore != null) {
      const compareValue = constraints.isBefore(args.object)

      if (compareValue != null) {
        return `${args.property} must be before ${compareValue}`
      }
    }

    if (constraints.isSameOrAfter != null) {
      const compareValue = constraints.isSameOrAfter(args.object)

      if (compareValue != null) {
        return `${args.property} must be same or after ${compareValue}`
      }
    }

    if (constraints.isSameOrBefore != null) {
      const compareValue = constraints.isSameOrBefore(args.object)

      if (compareValue != null) {
        return `${args.property} must be same or before ${compareValue}`
      }
    }

    return `${args.property} must be a ISO8601 string, infinity, +infinity or -infinity'`
  }
}
