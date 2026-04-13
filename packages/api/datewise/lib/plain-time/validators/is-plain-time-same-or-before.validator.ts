import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'
import { PlainTimeInput } from '../plain-time.js'
import { plainTime } from '../plain-time-entry.js'

type PlainTimeSameOrBeforeFn = (dto: object) => PlainTimeInput

export function IsPlainTimeSameOrBefore (
  timeCallback: PlainTimeSameOrBeforeFn,
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isPlainTimeSameOrBefore',
      target: object.constructor,
      propertyName,
      constraints: [timeCallback],
      options: validationOptions,
      validator: IsPlainTimeSameOrBeforeValidator
    })
  }
}

@ValidatorConstraint({ name: 'isAfterTimeString', async: false })
class IsPlainTimeSameOrBeforeValidator implements ValidatorConstraintInterface {
  validate (timeString: unknown, args: ValidationArguments): boolean {
    try {
      const time = plainTime(timeString as PlainTimeInput)
      const target = (args.constraints[0] as PlainTimeSameOrBeforeFn)(args.object)

      return time.isSameOrBefore(target)
    } catch {
      return false
    }
  }

  defaultMessage (args: ValidationArguments): string {
    const input = (args.constraints[0] as PlainTimeSameOrBeforeFn)(args.object)
    let target

    try {
      target = plainTime(input).toString()
    } catch {
      target = 'INVALID TIME INPUT'
    }

    return `${args.property} must be a plain time string same or before ${target}`
  }
}
