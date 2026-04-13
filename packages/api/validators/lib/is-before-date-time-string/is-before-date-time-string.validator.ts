import type {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraintInterface
} from 'class-validator'
import { ValidatorConstraint, registerDecorator } from 'class-validator'
import dayjs from 'dayjs'

export function IsBeforeDateTimeString (
  dateCallback: (argObject: object) => string | null,
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isBeforeDateTimeString',
      target: object.constructor,
      propertyName,
      constraints: [dateCallback],
      options: validationOptions,
      validator: IsBeforeDateTimeStringValidator
    })
  }
}

export function isBeforeDateTimeString (
  dateTimeString: unknown,
  args: ValidationArguments
): boolean {
  if (typeof dateTimeString !== 'string') return false

  const dateToCheck = dayjs(dateTimeString)

  if (!dateToCheck.isValid()) return false

  const comparisonDateString = (args.constraints[0] as (d: object) => string)(args.object)

  if (comparisonDateString === null) return false

  const comparisonDate = dayjs(comparisonDateString)

  if (!comparisonDate.isValid()) return false

  return dateToCheck.isBefore(comparisonDate)
}

@ValidatorConstraint({ name: 'isBeforeDateTimeString', async: false })
class IsBeforeDateTimeStringValidator implements ValidatorConstraintInterface {
  validate (dateString: unknown, args: ValidationArguments): boolean {
    return isBeforeDateTimeString(dateString, args)
  }

  defaultMessage (args: ValidationArguments): string {
    const beforeString: string = (args.constraints[0] as (d: object) => string)(args.object)

    return `${args.property} must be a date string before ${beforeString}`
  }
}
