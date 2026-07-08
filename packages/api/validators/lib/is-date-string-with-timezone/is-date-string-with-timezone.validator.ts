import type { ValidationOptions } from 'class-validator'
import { IsDateString, Matches } from 'class-validator'

const TIMEZONE_REGEX = /(Z|[+-]\d{2}:\d{2})$/
type IsDateStringOptions = Parameters<typeof IsDateString>[0]

/**  
 * Validates that the string is a ISO8601 string with a timezone. 
*/
export function IsDateStringWithTimezone (
  options?: IsDateStringOptions,
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return function (target: object, propertyKey: string | symbol): void {
    IsDateString(options, validationOptions)(target, propertyKey as string)
    Matches(TIMEZONE_REGEX, validationOptions)(target, propertyKey as string)
  }
}
