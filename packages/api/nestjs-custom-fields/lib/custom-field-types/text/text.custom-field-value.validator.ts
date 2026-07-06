import type { CustomFieldDefinitionFieldsByType } from '#src/custom-field-definition.js'
import { CustomFieldValueValidationError } from '#src/validators/custom-field-value-validation.error.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'

type TextCustomFieldDefinition = CustomFieldDefinitionFieldsByType<CustomFieldType.TEXT>

export function validateTextCustomFieldValue(
  definition: TextCustomFieldDefinition,
  value: string
): void {
  const rules = definition.rules

  if (rules === null) {
    return
  }

  if (rules.minLength !== undefined && value.length < rules.minLength) {
    throw new CustomFieldValueValidationError('Text custom field value can not be shorter than minLength')
  }

  if (rules.maxLength !== undefined && value.length > rules.maxLength) {
    throw new CustomFieldValueValidationError('Text custom field value can not be longer than maxLength')
  }

  if (rules.regex !== undefined && !new RegExp(rules.regex).test(value)) {
    throw new CustomFieldValueValidationError('Text custom field value must match the configured regex')
  }
}
