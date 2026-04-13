import type { ValidationOptions } from 'class-validator'
import { Matches } from 'class-validator'

/**
 * Validate that the value is a string with format hh:mm:ss
 */
export function IsTimeString (_validationOptions?: ValidationOptions): PropertyDecorator {
  return Matches(/^(?:([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]|24:00:00)$/)
}
