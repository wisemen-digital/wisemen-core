import type { ResolvedCustomFieldDefinitionFields } from '#src/custom-field-definition.js'
import { CustomFieldDefinitionError } from '#src/errors/custom-field-definition.error.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'

type TextCustomFieldDefinition = Extract<ResolvedCustomFieldDefinitionFields, { type: CustomFieldType.TEXT }>

export function validateTextCustomFieldDefinition(definition: TextCustomFieldDefinition): void {
  if (definition.choices !== null) {
    throw new CustomFieldDefinitionError('Only select custom fields can define choices')
  }

  const rules = definition.rules

  if (rules === null) {
    return
  }

  if (rules.minLength !== undefined && rules.minLength < 0) {
    throw new CustomFieldDefinitionError('Text custom field minLength can not be negative')
  }

  if (rules.maxLength !== undefined && rules.maxLength < 0) {
    throw new CustomFieldDefinitionError('Text custom field maxLength can not be negative')
  }

  if (
    rules.minLength !== undefined
    && rules.maxLength !== undefined
    && rules.minLength > rules.maxLength
  ) {
    throw new CustomFieldDefinitionError('Text custom field minLength can not be greater than maxLength')
  }

  if (rules.regex !== undefined) {
    try {
      new RegExp(rules.regex)
    } catch {
      throw new CustomFieldDefinitionError('Text custom field regex must be a valid regular expression')
    }
  }
}
