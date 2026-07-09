import type { BaseCustomFieldValue } from '#src/custom-field-value.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'
import type { TextCustomFieldTypeContract } from './text.contract.js'

export type TextCustomFieldValue = BaseCustomFieldValue<CustomFieldType.TEXT, TextCustomFieldTypeContract['value']>
export type TextCustomFieldColumnValue = BaseCustomFieldValue<CustomFieldType.TEXT, TextCustomFieldTypeContract['columnValue']>
