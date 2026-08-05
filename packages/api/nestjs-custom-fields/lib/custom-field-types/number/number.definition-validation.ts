import type { ResolvedCustomFieldDefinitionFields } from '#src/custom-field-definition.js'
import { CustomFieldDefinitionError } from '#src/errors/custom-field-definition.error.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'

type NumberCustomFieldDefinition = Extract<ResolvedCustomFieldDefinitionFields, { type: CustomFieldType.NUMBER }>

export function validateNumberCustomFieldDefinition(definition: NumberCustomFieldDefinition): void {
  if (definition.choices !== null) {
    throw new CustomFieldDefinitionError('Only select custom fields can define choices')
  }

  const rules = definition.rules

  if (rules === null) {
    return
  }

  if (
    rules.min !== undefined
    && rules.max !== undefined
    && rules.min > rules.max
  ) {
    throw new CustomFieldDefinitionError('Number custom field min can not be greater than max')
  }
}
