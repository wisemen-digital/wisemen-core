import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'
import { PlainTimeInput } from '../plain-time.js'
import { plainTime } from '../plain-time-entry.js'
import { InclusivityString } from '../../common/inclusivity.js'

type PlainTimeBetweenFn = (dto: object) => [ PlainTimeInput, PlainTimeInput ]

export function IsPlainTimeBetween (
  timeCallback: PlainTimeBetweenFn,
  inclusivity?: InclusivityString,
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isPlainTimeBetween',
      target: object.constructor,
      propertyName,
      constraints: [timeCallback, inclusivity],
      options: validationOptions,
      validator: IsPlainTimeBetweenValidator
    })
  }
}

@ValidatorConstraint({ name: 'isPlainTimeBetween', async: false })
class IsPlainTimeBetweenValidator implements ValidatorConstraintInterface {
  validate (timeString: unknown, args: ValidationArguments): boolean {
    try {
      const time = plainTime(timeString as PlainTimeInput)
      const [lowerBound, upperBound] = (args.constraints[0] as PlainTimeBetweenFn)(args.object)
      const inclusivity = args.constraints[1] as InclusivityString | undefined

      return time.isBetween(lowerBound, upperBound, inclusivity)
    } catch {
      return false
    }
  }

  defaultMessage (args: ValidationArguments): string {
    const [lowerBound, upperBound] = (args.constraints[0] as PlainTimeBetweenFn)(args.object)
    let lower
    let upper

    try {
      lower = plainTime(lowerBound).toString()
      upper = plainTime(upperBound).toString()
    } catch {
      lower ??= 'INVALID TIME INPUT'
      upper ??= 'INVALID TIME INPUT'
    }

    const [lowerIncl, upperIncl] = args.constraints[1] as InclusivityString ?? '[]'

    return `${args.property} must be a plain time string between ${lowerIncl}${lower},${upper}${upperIncl}`
  }
}
