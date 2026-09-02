import type { BaseCustomFieldValue } from '#src/custom-field-value.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'
import type { MonetaryCustomFieldTypeContract } from './monetary.contract.js'

export type MonetaryCustomFieldValue = BaseCustomFieldValue<CustomFieldType.MONETARY, MonetaryCustomFieldTypeContract['value']>
export type MonetaryCustomFieldColumnValue = BaseCustomFieldValue<CustomFieldType.MONETARY, MonetaryCustomFieldTypeContract['columnValue']>
