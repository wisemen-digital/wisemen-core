import type { CustomFieldDefinitionUuid } from '#src/custom-field-definition.uuid.js'
import type { CustomFieldValueByType } from '#src/custom-field-value.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'

export function customFieldValue<T extends CustomFieldType>(
  type: T,
  definitionUuid: CustomFieldDefinitionUuid,
  value: CustomFieldValueByType<T>['value']
): CustomFieldValueByType<T> {
  return {
    definitionUuid,
    type,
    value
  }
}
