import type { ValidatorConstraintInterface, ValidationArguments, ValidationOptions } from 'class-validator'
import { Validate, ValidatorConstraint, ValidateNested } from 'class-validator'
import { applyDecorators } from '@nestjs/common'
import { Type } from 'class-transformer'
import { LocalizedStringCommand } from '#src/localized-string.command.js'

export interface IsLocalizedStringOptions extends ValidationOptions {
  requiredLanguages?: string[]
  forbidNonRequiredLanguages?: boolean
}

/** Validate that the localized string contains required languages and optionally forbids
 * non-required languages */
export function IsLocalizedString (options?: IsLocalizedStringOptions): PropertyDecorator {
  const {
    requiredLanguages = [],
    forbidNonRequiredLanguages = false,
    ...validationOptions
  } = options ?? {}

  return applyDecorators(
    Type(() => LocalizedStringCommand),
    ValidateNested(),
    Validate(
      IsLocalizedStringValidator,
      [requiredLanguages, forbidNonRequiredLanguages],
      validationOptions
    )
  )
}

@ValidatorConstraint({ name: 'isLocalizedString', async: false })
export class IsLocalizedStringValidator implements ValidatorConstraintInterface {
  validate (value: unknown, args: ValidationArguments): boolean {
    if (value == null || typeof value !== 'object') {
      return false
    }

    const localizedString = value as LocalizedStringCommand
    const [requiredLanguages, forbidNonRequiredLanguages] = args.constraints as [string[], boolean]

    if (!Array.isArray(localizedString.items)) {
      return false
    }

    const languages = localizedString.items.map(item => item.locale)

    // Check if all required languages are present
    for (const requiredLanguage of requiredLanguages) {
      if (!languages.includes(requiredLanguage)) {
        return false
      }
    }

    // Check if non-required languages are forbidden
    if (forbidNonRequiredLanguages) {
      for (const language of languages) {
        if (!requiredLanguages.includes(language)) {
          return false
        }
      }
    }

    return true
  }

  defaultMessage (args: ValidationArguments): string {
    const [requiredLanguages, forbidNonRequiredLanguages] = args.constraints as [string[], boolean]

    if (requiredLanguages.length > 0 && forbidNonRequiredLanguages) {
      return `${args.property} must contain exactly these languages: ${requiredLanguages.join(', ')}`
    }

    if (requiredLanguages.length > 0) {
      return `${args.property} must contain the following languages: ${requiredLanguages.join(', ')}`
    }

    return `${args.property} must be a valid localized string`
  }
}
