import type { ValidationOptions } from 'class-validator'
import { Matches } from 'class-validator'
import { TIME_REGEX } from '../is-valid-time-string.js'

/** Validate that the value is a string with format hh:mm:ss */
export function IsPlainTime (validationOptions?: ValidationOptions): PropertyDecorator {
  return Matches(TIME_REGEX, validationOptions)
}
