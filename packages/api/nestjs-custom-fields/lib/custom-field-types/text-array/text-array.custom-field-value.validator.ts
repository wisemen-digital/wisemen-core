import type { CustomFieldDefinitionFieldsByType } from '#src/custom-field-definition.js'
import { CustomFieldValueValidationError } from '#src/validators/custom-field-value-validation.error.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'

type TextArrayCustomFieldDefinition = CustomFieldDefinitionFieldsByType<CustomFieldType.TEXT_ARRAY>

export function validateTextArrayCustomFieldValue(
  definition: TextArrayCustomFieldDefinition,
  value: string[]
): void {
  const rules = definition.rules

  if (rules === null) {
    return
  }

  if (rules.minItems !== undefined && value.length < rules.minItems) {
    throw new CustomFieldValueValidationError('Text array custom field value can not contain fewer than minItems')
  }

  if (rules.maxItems !== undefined && value.length > rules.maxItems) {
    throw new CustomFieldValueValidationError('Text array custom field value can not contain more than maxItems')
  }
}
