import type { ValidatorConstraintInterface, ValidationArguments, ValidationOptions } from 'class-validator'
import { Validate, ValidatorConstraint } from 'class-validator'
import type { LocalizedStringItemCommand } from '#src/localized-string.command.js'

/** Validate that each language is only present once in the items array */
export function IsUniqueLanguage (validationOptions?: ValidationOptions): PropertyDecorator {
  return Validate(IsUniqueLanguageValidator, [], validationOptions)
}

@ValidatorConstraint({ name: 'isUniqueLanguage', async: false })
export class IsUniqueLanguageValidator implements ValidatorConstraintInterface {
  validate (items: unknown): boolean {
    if (!Array.isArray(items)) {
      return false
    }

    const languages = (items as LocalizedStringItemCommand[]).map(item => item.locale)
    const uniqueLanguages = new Set(languages)

    return languages.length === uniqueLanguages.size
  }

  defaultMessage (args: ValidationArguments): string {
    return `${args.property} must contain unique languages only`
  }
}
