import type { PlainDate } from '@wisemen/datewise'
import type { CustomFieldDefinitionFieldsByType } from '#src/custom-field-definition.js'
import { CustomFieldValueValidationError } from '#src/validators/custom-field-value-validation.error.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'

type DateCustomFieldDefinition = CustomFieldDefinitionFieldsByType<CustomFieldType.DATE>

export function validateDateCustomFieldValue(
  definition: DateCustomFieldDefinition,
  value: PlainDate
): void {
  const rules = definition.rules

  if (rules === null) {
    return
  }

  if (rules.minDate !== undefined && value.isBefore(rules.minDate)) {
    throw new CustomFieldValueValidationError('Date custom field value can not be before minDate')
  }

  if (rules.maxDate !== undefined && value.isAfter(rules.maxDate)) {
    throw new CustomFieldValueValidationError('Date custom field value can not be after maxDate')
  }
}
