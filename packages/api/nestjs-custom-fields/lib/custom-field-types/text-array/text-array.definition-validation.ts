import type { ResolvedCustomFieldDefinitionFields } from '#src/custom-field-definition.js'
import { CustomFieldDefinitionError } from '#src/errors/custom-field-definition.error.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'

type TextArrayCustomFieldDefinition = Extract<ResolvedCustomFieldDefinitionFields, { type: CustomFieldType.TEXT_ARRAY }>

export function validateTextArrayCustomFieldDefinition(definition: TextArrayCustomFieldDefinition): void {
  if (definition.choices !== null) {
    throw new CustomFieldDefinitionError('Only select custom fields can define choices')
  }

  const rules = definition.rules

  if (rules === null) {
    return
  }

  if (rules.minItems !== undefined && rules.minItems < 0) {
    throw new CustomFieldDefinitionError('Text array custom field minItems can not be negative')
  }

  if (rules.maxItems !== undefined && rules.maxItems < 0) {
    throw new CustomFieldDefinitionError('Text array custom field maxItems can not be negative')
  }

  if (
    rules.minItems !== undefined
    && rules.maxItems !== undefined
    && rules.minItems > rules.maxItems
  ) {
    throw new CustomFieldDefinitionError('Text array custom field minItems can not be greater than maxItems')
  }
}
