import type {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraintInterface
} from 'class-validator'
import { ValidatorConstraint, registerDecorator } from 'class-validator'
import dayjs from 'dayjs'

export function IsAfterDateTimeString (
  dateCallback: (argObject: object) => string | null,
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isAfterDateTimeString',
      target: object.constructor,
      propertyName,
      constraints: [dateCallback],
      options: validationOptions,
      validator: IsAfterDateTimeStringValidator
    })
  }
}

export function isAfterDateTimeString (
  dateTimeString: unknown,
  args: ValidationArguments
): boolean {
  if (typeof dateTimeString !== 'string') return false

  const dateToCheck = dayjs(dateTimeString)

  if (!dateToCheck.isValid()) return false

  const comparisonDateString = (args.constraints[0] as (d: object) => string | null)(args.object)

  if (comparisonDateString === null) return false

  const comparisonDate = dayjs(comparisonDateString)

  if (!comparisonDate.isValid()) return false

  return dateToCheck.isAfter(comparisonDate)
}

@ValidatorConstraint({ name: 'isAfterDateTimeString', async: false })
class IsAfterDateTimeStringValidator implements ValidatorConstraintInterface {
  validate (dateString: unknown, args: ValidationArguments): boolean {
    return isAfterDateTimeString(dateString, args)
  }

  defaultMessage (args: ValidationArguments): string {
    const afterString = (args.constraints[0] as (d: object) => string | null)(args.object)

    return `${args.property} must be a date string after ${afterString}`
  }
}
