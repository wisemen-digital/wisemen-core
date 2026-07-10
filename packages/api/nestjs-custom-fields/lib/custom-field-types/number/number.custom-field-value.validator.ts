import type { CustomFieldDefinitionFieldsByType } from '#src/custom-field-definition.js'
import { CustomFieldValueValidationError } from '#src/validators/custom-field-value-validation.error.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'

type NumberCustomFieldDefinition = CustomFieldDefinitionFieldsByType<CustomFieldType.NUMBER>

export function validateNumberCustomFieldValue(
  definition: NumberCustomFieldDefinition,
  value: number
): void {
  const rules = definition.rules

  if (rules === null) {
    return
  }

  if (rules.min !== undefined && value < rules.min) {
    throw new CustomFieldValueValidationError('Number custom field value can not be lower than min')
  }

  if (rules.max !== undefined && value > rules.max) {
    throw new CustomFieldValueValidationError('Number custom field value can not be greater than max')
  }
}
