import type { CustomFieldDefinitionFieldsByType } from '#src/custom-field-definition.js'
import { CustomFieldValueValidationError } from '#src/validators/custom-field-value-validation.error.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'

type SingleSelectCustomFieldDefinition = CustomFieldDefinitionFieldsByType<CustomFieldType.SINGLE_SELECT>

export function validateSingleSelectCustomFieldValue(
  definition: SingleSelectCustomFieldDefinition,
  value: string
): void {
  if (definition.choices === null) {
    throw new CustomFieldValueValidationError('Select custom field definition must define choices')
  }

  if (!definition.choices.some(choice => choice.value === value)) {
    throw new CustomFieldValueValidationError('Single select custom field value must be one of the defined choices')
  }
}
