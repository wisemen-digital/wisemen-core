import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'
import { PlainTimeInput } from '../plain-time.js'
import { plainTime } from '../plain-time-entry.js'

type PlainTimeBeforeFn = (dto: object) => PlainTimeInput

export function IsPlainTimeBefore (
  timeCallback: PlainTimeBeforeFn,
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isPlainTimeBefore',
      target: object.constructor,
      propertyName,
      constraints: [timeCallback],
      options: validationOptions,
      validator: IsPlainTimeBeforeValidator
    })
  }
}

@ValidatorConstraint({ name: 'isPlainTimeBefore', async: false })
class IsPlainTimeBeforeValidator implements ValidatorConstraintInterface {
  validate (timeString: unknown, args: ValidationArguments): boolean {
    try {
      const time = plainTime(timeString as PlainTimeInput)
      const target = (args.constraints[0] as PlainTimeBeforeFn)(args.object)

      return time.isBefore(target)
    } catch {
      return false
    }
  }

  defaultMessage (args: ValidationArguments): string {
    const input = (args.constraints[0] as PlainTimeBeforeFn)(args.object)
    let target

    try {
      target = plainTime(input).toString()
    } catch {
      target = 'INVALID TIME INPUT'
    }

    return `${args.property} must be a plain time string before ${target}`
  }
}
