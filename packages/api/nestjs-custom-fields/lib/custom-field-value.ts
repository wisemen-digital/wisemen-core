import { CustomFieldType } from './enum/custom-field-type.enum.js'
import { CustomFieldDefinitionUuid } from '#src/custom-field-definition.uuid.js'
import type { CustomFieldTypeContract } from './custom-field-type-contract.js'

export type BaseCustomFieldValue<TType extends CustomFieldType, TValue> = {
  definitionUuid: CustomFieldDefinitionUuid
  type: TType
  value: TValue
}

export type CustomFieldSelectValue = string

export type CustomFieldValueByType<T extends CustomFieldType> = BaseCustomFieldValue<T, CustomFieldTypeContract[T]['value']>
export type CustomFieldColumnValueByType<T extends CustomFieldType> = BaseCustomFieldValue<T, CustomFieldTypeContract[T]['columnValue']>

export type CustomFieldValue = {
  [T in CustomFieldType]: CustomFieldValueByType<T>
}[CustomFieldType]


export type CustomFieldColumnValue = {
  [T in CustomFieldType]: CustomFieldColumnValueByType<T>
}[CustomFieldType]
