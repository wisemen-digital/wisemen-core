import type { BaseCustomFieldValue } from '#src/custom-field-value.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'
import type { DateCustomFieldTypeContract } from './date.contract.js'

export type DateCustomFieldValue = BaseCustomFieldValue<CustomFieldType.DATE, DateCustomFieldTypeContract['value']>
export type DateCustomFieldColumnValue = BaseCustomFieldValue<CustomFieldType.DATE, DateCustomFieldTypeContract['columnValue']>
