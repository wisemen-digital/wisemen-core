import type { CustomFieldDefinitionFieldsByType } from '#src/custom-field-definition.js'
import { CustomFieldValueValidationError } from '#src/validators/custom-field-value-validation.error.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'

type MultiSelectCustomFieldDefinition = CustomFieldDefinitionFieldsByType<CustomFieldType.MULTI_SELECT>

export function validateMultiSelectCustomFieldValue(
  definition: MultiSelectCustomFieldDefinition,
  value: string[]
): void {
  if (definition.choices === null) {
    throw new CustomFieldValueValidationError('Select custom field definition must define choices')
  }

  for (const selectedValue of value) {
    if (!definition.choices.some(choice => choice.value === selectedValue)) {
      throw new CustomFieldValueValidationError('Multi select custom field value must only contain defined choices')
    }
  }

  if (new Set(value).size !== value.length) {
    throw new CustomFieldValueValidationError('Multi select custom field value can not contain duplicate values')
  }

  const rules = definition.rules

  if (rules === null) {
    return
  }

  if (rules.minSelections !== undefined && value.length < rules.minSelections) {
    throw new CustomFieldValueValidationError('Multi select custom field value can not contain fewer than minSelections')
  }

  if (rules.maxSelections !== undefined && value.length > rules.maxSelections) {
    throw new CustomFieldValueValidationError('Multi select custom field value can not contain more than maxSelections')
  }
}
