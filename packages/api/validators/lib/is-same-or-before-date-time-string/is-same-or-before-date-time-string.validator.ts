import type {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraintInterface
} from 'class-validator'
import { ValidatorConstraint, registerDecorator } from 'class-validator'
import dayjs from 'dayjs'

export function IsSameOrBeforeDateTimeString (
  dateCallback: (argObject: object) => string | null,
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isSameOrBeforeDateTimeString',
      target: object.constructor,
      propertyName,
      constraints: [dateCallback],
      options: validationOptions,
      validator: IsSameOrBeforeDateTimeStringValidator
    })
  }
}

export function isSameOrBeforeDateTimeString (
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

  return dateToCheck.isSame(comparisonDate) || dateToCheck.isBefore(comparisonDate)
}

@ValidatorConstraint({ name: 'isSameOrBeforeDateTimeString', async: false })
class IsSameOrBeforeDateTimeStringValidator implements ValidatorConstraintInterface {
  validate (dateString: unknown, args: ValidationArguments): boolean {
    return isSameOrBeforeDateTimeString(dateString, args)
  }

  defaultMessage (args: ValidationArguments): string {
    const beforeString: string = (args.constraints[0] as (d: object) => string)(args.object)

    return `${args.property} must be a date string before or the same as ${beforeString}`
  }
}
