import type {
  ValidationOptions,
  ValidatorConstraintInterface, ValidationArguments
} from 'class-validator'
import {
  Validate,
  ValidatorConstraint
} from 'class-validator'
import { Transform } from 'class-transformer'
import type { CountryCode } from 'libphonenumber-js'
import { parsePhoneNumberWithError } from 'libphonenumber-js'

export interface IsPhoneNumberValidationOptions extends ValidationOptions {
  defaultCountry?: CountryCode
}

export function IsPhoneNumber (validationOptions?: IsPhoneNumberValidationOptions): PropertyDecorator {
  return function (target: object, propertyKey: string | symbol): void {
    Transform(({ value }: { value: unknown }) => toE164(value, validationOptions?.defaultCountry))(target, propertyKey)

    Validate(
      IsPhoneNumberValidator,
      [{ defaultCountry: validationOptions?.defaultCountry }],
      validationOptions
    )(target, propertyKey)
  }
}

function toE164 (value: unknown, defaultCountry?: CountryCode): unknown {
  if (typeof value !== 'string') return value

  try {
    return parsePhoneNumberWithError(value, defaultCountry).number
  } catch {
    return value
  }
}

interface ValidatorConstraints {
  defaultCountry?: CountryCode
}

@ValidatorConstraint({ name: 'isPhoneNumber', async: false })
class IsPhoneNumberValidator implements ValidatorConstraintInterface {
  validate (phoneNumber: unknown, args: ValidationArguments): boolean {
    if (typeof phoneNumber !== 'string') return false

    const { defaultCountry } = args.constraints[0] as ValidatorConstraints

    try {
      return parsePhoneNumberWithError(phoneNumber, defaultCountry).isValid()
    } catch {
      return false
    }
  }

  defaultMessage (args: ValidationArguments): string {
    return `${args.property} must be a valid phone number`
  }
}
