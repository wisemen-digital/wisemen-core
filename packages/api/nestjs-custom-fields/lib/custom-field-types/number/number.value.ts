import type { BaseCustomFieldValue } from '#src/custom-field-value.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'
import type { NumberCustomFieldTypeContract } from './number.contract.js'

export type NumberCustomFieldValue = BaseCustomFieldValue<CustomFieldType.NUMBER, NumberCustomFieldTypeContract['value']>
export type NumberCustomFieldColumnValue = BaseCustomFieldValue<CustomFieldType.NUMBER, NumberCustomFieldTypeContract['columnValue']>
