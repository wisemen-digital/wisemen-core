import type { BaseCustomFieldValue } from '#src/custom-field-value.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'
import type { TextArrayCustomFieldTypeContract } from './text-array.contract.js'

export type TextArrayCustomFieldValue = BaseCustomFieldValue<CustomFieldType.TEXT_ARRAY, TextArrayCustomFieldTypeContract['value']>
export type TextArrayCustomFieldColumnValue = BaseCustomFieldValue<CustomFieldType.TEXT_ARRAY, TextArrayCustomFieldTypeContract['columnValue']>
