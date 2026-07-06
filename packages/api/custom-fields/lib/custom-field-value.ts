import { CustomFieldType } from './enum/custom-field-type.enum.js'
import type { CustomFieldColumnValueByType as PersistedCustomFieldValueByType, CustomFieldDomainValueByType } from './custom-field-type-contract.js'
import { CustomFieldDefinitionUuid } from '#src/custom-field-definition.uuid.js'

export type BaseCustomFieldValue<TType extends CustomFieldType, TValue> = {
  definitionUuid: CustomFieldDefinitionUuid
  type: TType
  value: TValue
}

export type CustomFieldSelectValue = string

export type CustomFieldValueByType<T extends CustomFieldType> = BaseCustomFieldValue<T, CustomFieldDomainValueByType<T>>
export type CustomFieldColumnValueByType<T extends CustomFieldType> = BaseCustomFieldValue<T, PersistedCustomFieldValueByType<T>>

export type TextCustomFieldValue = CustomFieldValueByType<CustomFieldType.TEXT>
export type TextArrayCustomFieldValue = CustomFieldValueByType<CustomFieldType.TEXT_ARRAY>
export type NumberCustomFieldValue = CustomFieldValueByType<CustomFieldType.NUMBER>
export type BooleanCustomFieldValue = CustomFieldValueByType<CustomFieldType.BOOLEAN>
export type DateCustomFieldValue = CustomFieldValueByType<CustomFieldType.DATE>
export type TimestampCustomFieldValue = CustomFieldValueByType<CustomFieldType.TIMESTAMP>
export type SingleSelectCustomFieldValue = CustomFieldValueByType<CustomFieldType.SINGLE_SELECT>
export type MultiSelectCustomFieldValue = CustomFieldValueByType<CustomFieldType.MULTI_SELECT>
export type MonetaryCustomFieldValue = CustomFieldValueByType<CustomFieldType.MONETARY>

export type CustomFieldValue = {
  [T in CustomFieldType]: CustomFieldValueByType<T>
}[CustomFieldType]

export type TextCustomFieldColumnValue = CustomFieldColumnValueByType<CustomFieldType.TEXT>
export type TextArrayCustomFieldColumnValue = CustomFieldColumnValueByType<CustomFieldType.TEXT_ARRAY>
export type NumberCustomFieldColumnValue = CustomFieldColumnValueByType<CustomFieldType.NUMBER>
export type BooleanCustomFieldColumnValue = CustomFieldColumnValueByType<CustomFieldType.BOOLEAN>
export type DateCustomFieldColumnValue = CustomFieldColumnValueByType<CustomFieldType.DATE>
export type TimestampCustomFieldColumnValue = CustomFieldColumnValueByType<CustomFieldType.TIMESTAMP>
export type SingleSelectCustomFieldColumnValue = CustomFieldColumnValueByType<CustomFieldType.SINGLE_SELECT>
export type MultiSelectCustomFieldColumnValue = CustomFieldColumnValueByType<CustomFieldType.MULTI_SELECT>
export type MonetaryCustomFieldColumnValue = CustomFieldColumnValueByType<CustomFieldType.MONETARY>

export type CustomFieldColumnValue = {
  [T in CustomFieldType]: CustomFieldColumnValueByType<T>
}[CustomFieldType]
