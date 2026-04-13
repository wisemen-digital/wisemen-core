import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'
import { PlainTimeInput } from '../plain-time.js'
import { plainTime } from '../plain-time-entry.js'

type PlainTimeSameOrAfterFn = (dto: object) => PlainTimeInput

export function IsPlainTimeSameOrAfter (
  timeCallback: PlainTimeSameOrAfterFn,
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isPlainTimeSameOrAfter',
      target: object.constructor,
      propertyName,
      constraints: [timeCallback],
      options: validationOptions,
      validator: IsPlainTimeSameOrAfterValidator
    })
  }
}

@ValidatorConstraint({ name: 'isPlainTimeSameOrAfter', async: false })
class IsPlainTimeSameOrAfterValidator implements ValidatorConstraintInterface {
  validate (timeString: unknown, args: ValidationArguments): boolean {
    try {
      const time = plainTime(timeString as PlainTimeInput)
      const target = (args.constraints[0] as PlainTimeSameOrAfterFn)(args.object)

      return time.isSameOrAfter(target)
    } catch {
      return false
    }
  }

  defaultMessage (args: ValidationArguments): string {
    const input = (args.constraints[0] as PlainTimeSameOrAfterFn)(args.object)
    let target

    try {
      target = plainTime(input).toString()
    } catch {
      target = 'INVALID TIME INPUT'
    }

    return `${args.property} must be a plain time string same or after ${target}`
  }
}
