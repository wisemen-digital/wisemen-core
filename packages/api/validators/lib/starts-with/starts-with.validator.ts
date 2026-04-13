// starts-with.decorator.ts
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments
} from 'class-validator'

export function StartsWith (
  prefixes: string[],
  caseSensitive: boolean = true,
  validationOptions?: ValidationOptions
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'startsWith',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [prefixes, caseSensitive],
      options: validationOptions,
      validator: {
        validate (value: unknown, args: ValidationArguments): boolean {
          const [prefixes, caseSensitive] = args.constraints as [string[], boolean]

          if (typeof value !== 'string') return false

          return prefixes.some((prefix: string) => {
            if (caseSensitive) {
              return value.startsWith(prefix)
            } else {
              return value.toLowerCase().startsWith(prefix.toLowerCase())
            }
          })
        },
        defaultMessage (args: ValidationArguments) {
          const [prefixes, caseSensitive] = args.constraints as [string[], boolean]

          return `${args.property} must start with one of the following: ${prefixes.join(', ')}${
            !caseSensitive ? ' (case insensitive)' : ''
          }`
        }
      }
    })
  }
}
