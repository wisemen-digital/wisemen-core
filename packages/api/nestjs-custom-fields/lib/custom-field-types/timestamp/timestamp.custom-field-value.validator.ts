import type { Timestamp } from '@wisemen/datewise'
import type { CustomFieldDefinitionFieldsByType } from '#src/custom-field-definition.js'
import { CustomFieldValueValidationError } from '#src/validators/custom-field-value-validation.error.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'

type TimestampCustomFieldDefinition = CustomFieldDefinitionFieldsByType<CustomFieldType.TIMESTAMP>

export function validateTimestampCustomFieldValue(
  definition: TimestampCustomFieldDefinition,
  value: Timestamp
): void {
  const rules = definition.rules

  if (rules === null) {
    return
  }

  if (rules.minDate !== undefined && value.isBefore(rules.minDate)) {
    throw new CustomFieldValueValidationError('Timestamp custom field value can not be before minDate')
  }

  if (rules.maxDate !== undefined && value.isAfter(rules.maxDate)) {
    throw new CustomFieldValueValidationError('Timestamp custom field value can not be after maxDate')
  }
}
