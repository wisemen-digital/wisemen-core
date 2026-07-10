import type { ResolvedCustomFieldDefinitionFields } from '#src/custom-field-definition.js'
import { CustomFieldDefinitionError } from '#src/errors/custom-field-definition.error.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'

type BooleanCustomFieldDefinition = Extract<ResolvedCustomFieldDefinitionFields, { type: CustomFieldType.BOOLEAN }>

export function validateBooleanCustomFieldDefinition(definition: BooleanCustomFieldDefinition): void {
  if (definition.choices !== null) {
    throw new CustomFieldDefinitionError('Only select custom fields can define choices')
  }

  if (definition.rules !== null) {
    throw new CustomFieldDefinitionError('Boolean custom field can not define rules')
  }
}
