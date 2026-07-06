import { CustomFieldType } from './enum/custom-field-type.enum.js'
import { CustomFieldDefinitionUuid } from '#src/custom-field-definition.uuid.js'
import type { CustomFieldTypeContract } from './custom-field-type-contract.js'
import type { BooleanCustomFieldColumnValue as BooleanCustomFieldColumnValueModel, BooleanCustomFieldValue as BooleanCustomFieldValueModel } from '#src/custom-field-types/boolean/boolean.value.js'
import type { DateCustomFieldColumnValue as DateCustomFieldColumnValueModel, DateCustomFieldValue as DateCustomFieldValueModel } from '#src/custom-field-types/date/date.value.js'
import type { MonetaryCustomFieldColumnValue as MonetaryCustomFieldColumnValueModel, MonetaryCustomFieldValue as MonetaryCustomFieldValueModel } from '#src/custom-field-types/monetary/monetary.value.js'
import type { MultiSelectCustomFieldColumnValue as MultiSelectCustomFieldColumnValueModel, MultiSelectCustomFieldValue as MultiSelectCustomFieldValueModel } from '#src/custom-field-types/multi-select/multi-select.value.js'
import type { NumberCustomFieldColumnValue as NumberCustomFieldColumnValueModel, NumberCustomFieldValue as NumberCustomFieldValueModel } from '#src/custom-field-types/number/number.value.js'
import type { SingleSelectCustomFieldColumnValue as SingleSelectCustomFieldColumnValueModel, SingleSelectCustomFieldValue as SingleSelectCustomFieldValueModel } from '#src/custom-field-types/single-select/single-select.value.js'
import type { TextArrayCustomFieldColumnValue as TextArrayCustomFieldColumnValueModel, TextArrayCustomFieldValue as TextArrayCustomFieldValueModel } from '#src/custom-field-types/text-array/text-array.value.js'
import type { TextCustomFieldColumnValue as TextCustomFieldColumnValueModel, TextCustomFieldValue as TextCustomFieldValueModel } from '#src/custom-field-types/text/text.value.js'
import type { TimestampCustomFieldColumnValue as TimestampCustomFieldColumnValueModel, TimestampCustomFieldValue as TimestampCustomFieldValueModel } from '#src/custom-field-types/timestamp/timestamp.value.js'

export type BaseCustomFieldValue<TType extends CustomFieldType, TValue> = {
  definitionUuid: CustomFieldDefinitionUuid
  type: TType
  value: TValue
}

export type CustomFieldSelectValue = string

export type CustomFieldValueByType<T extends CustomFieldType> = BaseCustomFieldValue<T, CustomFieldTypeContract[T]['value']>
export type CustomFieldColumnValueByType<T extends CustomFieldType> = BaseCustomFieldValue<T, CustomFieldTypeContract[T]['columnValue']>

export type TextCustomFieldValue = TextCustomFieldValueModel
export type TextArrayCustomFieldValue = TextArrayCustomFieldValueModel
export type NumberCustomFieldValue = NumberCustomFieldValueModel
export type BooleanCustomFieldValue = BooleanCustomFieldValueModel
export type DateCustomFieldValue = DateCustomFieldValueModel
export type TimestampCustomFieldValue = TimestampCustomFieldValueModel
export type SingleSelectCustomFieldValue = SingleSelectCustomFieldValueModel
export type MultiSelectCustomFieldValue = MultiSelectCustomFieldValueModel
export type MonetaryCustomFieldValue = MonetaryCustomFieldValueModel

export type CustomFieldValue = {
  [T in CustomFieldType]: CustomFieldValueByType<T>
}[CustomFieldType]

export type TextCustomFieldColumnValue = TextCustomFieldColumnValueModel
export type TextArrayCustomFieldColumnValue = TextArrayCustomFieldColumnValueModel
export type NumberCustomFieldColumnValue = NumberCustomFieldColumnValueModel
export type BooleanCustomFieldColumnValue = BooleanCustomFieldColumnValueModel
export type DateCustomFieldColumnValue = DateCustomFieldColumnValueModel
export type TimestampCustomFieldColumnValue = TimestampCustomFieldColumnValueModel
export type SingleSelectCustomFieldColumnValue = SingleSelectCustomFieldColumnValueModel
export type MultiSelectCustomFieldColumnValue = MultiSelectCustomFieldColumnValueModel
export type MonetaryCustomFieldColumnValue = MonetaryCustomFieldColumnValueModel

export type CustomFieldColumnValue = {
  [T in CustomFieldType]: CustomFieldColumnValueByType<T>
}[CustomFieldType]
