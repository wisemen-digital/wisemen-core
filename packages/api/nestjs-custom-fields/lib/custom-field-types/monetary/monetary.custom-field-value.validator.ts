import { Currency, Monetary } from '@wisemen/monetary'
import type { CustomFieldDefinitionFieldsByType } from '#src/custom-field-definition.js'
import { CustomFieldValueValidationError } from '#src/validators/custom-field-value-validation.error.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'

type MonetaryCustomFieldDefinition = CustomFieldDefinitionFieldsByType<CustomFieldType.MONETARY>

export function validateMonetaryCustomFieldValue(
  definition: MonetaryCustomFieldDefinition,
  value: Monetary<Currency>
): void {
  const rules = definition.rules

  if (rules === null) {
    throw new CustomFieldValueValidationError('Monetary custom field definition must define rules')
  }

  if (rules.currencies !== undefined && !rules.currencies.includes(value.currency)) {
    throw new CustomFieldValueValidationError('Monetary custom field value must use an allowed currency')
  }

  if (value.precision !== rules.precision) {
    throw new CustomFieldValueValidationError('Monetary custom field value precision must match the configured precision')
  }

  if (rules.min !== undefined) {
    const min = new Monetary(rules.min, value.currency, rules.precision)

    if (value.isLessThan(min)) {
      throw new CustomFieldValueValidationError('Monetary custom field value can not be lower than min')
    }
  }

  if (rules.max !== undefined) {
    const max = new Monetary(rules.max, value.currency, rules.precision)

    if (value.isMoreThan(max)) {
      throw new CustomFieldValueValidationError('Monetary custom field value can not be greater than max')
    }
  }
}
