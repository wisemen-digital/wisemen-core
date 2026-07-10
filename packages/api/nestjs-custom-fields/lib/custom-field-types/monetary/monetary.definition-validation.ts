import type { ResolvedCustomFieldDefinitionFields } from '#src/custom-field-definition.js'
import { CustomFieldDefinitionError } from '#src/errors/custom-field-definition.error.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'

type MonetaryCustomFieldDefinition = Extract<ResolvedCustomFieldDefinitionFields, { type: CustomFieldType.MONETARY }>

export function validateMonetaryCustomFieldDefinition(definition: MonetaryCustomFieldDefinition): void {
  if (definition.choices !== null) {
    throw new CustomFieldDefinitionError('Only select custom fields can define choices')
  }

  const rules = definition.rules

  if (rules === null) {
    throw new CustomFieldDefinitionError('Monetary custom field rules are required')
  }

  if (rules.currencies !== undefined && rules.currencies.length === 0) {
    throw new CustomFieldDefinitionError('Monetary custom field must define at least one allowed currency')
  }

  if (rules.precision === undefined) {
    throw new CustomFieldDefinitionError('Monetary custom field precision is required')
  }

  if (rules.precision <= 0) {
    throw new CustomFieldDefinitionError('Monetary custom field precision must be greater than zero')
  }

  if (
    rules.min !== undefined
    && rules.max !== undefined
    && rules.min > rules.max
  ) {
    throw new CustomFieldDefinitionError('Monetary custom field min can not be greater than max')
  }
}
