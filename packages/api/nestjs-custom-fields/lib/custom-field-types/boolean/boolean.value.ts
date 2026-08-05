import type { BaseCustomFieldValue } from '#src/custom-field-value.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'
import type { BooleanCustomFieldTypeContract } from './boolean.contract.js'

export type BooleanCustomFieldValue = BaseCustomFieldValue<CustomFieldType.BOOLEAN, BooleanCustomFieldTypeContract['value']>
export type BooleanCustomFieldColumnValue = BaseCustomFieldValue<CustomFieldType.BOOLEAN, BooleanCustomFieldTypeContract['columnValue']>
