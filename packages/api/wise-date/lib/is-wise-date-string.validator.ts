import { IsDateWithoutTimeString } from '@wisemen/validators'
import { ValidationOptions } from 'class-validator'

export function IsWiseDateString (options?: ValidationOptions) {
  return IsDateWithoutTimeString({ ...options, allowInfinity: true })
}
