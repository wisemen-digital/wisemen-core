import type {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraintInterface
} from 'class-validator'
import { ValidatorConstraint, registerDecorator } from 'class-validator'
import dayjs from 'dayjs'

export function IsSameOrAfterDateTimeString (
  dateCallback: (argObject: object) => string | null,
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isSameOrAfterDateTimeString',
      target: object.constructor,
      propertyName,
      constraints: [dateCallback],
      options: validationOptions,
      validator: IsSameOrAfterDateTimeStringValidator
    })
  }
}

export function isSameOrAfterDateTimeString (
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

  return dateToCheck.isSame(comparisonDate) || dateToCheck.isAfter(comparisonDate)
}

@ValidatorConstraint({ name: 'isSameOrAfterDateTimeString', async: false })
class IsSameOrAfterDateTimeStringValidator implements ValidatorConstraintInterface {
  validate (dateString: unknown, args: ValidationArguments): boolean {
    return isSameOrAfterDateTimeString(dateString, args)
  }

  defaultMessage (args: ValidationArguments): string {
    const afterString: string = (args.constraints[0] as (d: object) => string)(args.object)

    return `${args.property} must be a date string after or the same as ${afterString}`
  }
}
