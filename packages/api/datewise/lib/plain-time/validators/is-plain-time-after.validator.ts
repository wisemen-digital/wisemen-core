import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'
import { PlainTimeInput } from '../plain-time.js'
import { plainTime } from '../plain-time-entry.js'

type PlainTimeAfterFn = (dto: object) => PlainTimeInput

export function IsPlainTimeAfter (
  timeCallback: PlainTimeAfterFn,
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isPlainTimeAfter',
      target: object.constructor,
      propertyName,
      constraints: [timeCallback],
      options: validationOptions,
      validator: IsPlainTimeAfterValidator
    })
  }
}

@ValidatorConstraint({ name: 'isPlainTimeAfter', async: false })
class IsPlainTimeAfterValidator implements ValidatorConstraintInterface {
  validate (timeString: unknown, args: ValidationArguments): boolean {
    try {
      const time = plainTime(timeString as PlainTimeInput)
      const target = (args.constraints[0] as PlainTimeAfterFn)(args.object)

      return time.isAfter(target)
    } catch {
      return false
    }
  }

  defaultMessage (args: ValidationArguments): string {
    const input = (args.constraints[0] as PlainTimeAfterFn)(args.object)
    let target

    try {
      target = plainTime(input).toString()
    } catch {
      target = 'INVALID TIME INPUT'
    }

    return `${args.property} must be a plain time string after ${target}`
  }
}
