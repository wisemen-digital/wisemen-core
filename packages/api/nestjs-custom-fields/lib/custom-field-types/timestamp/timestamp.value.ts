import type { BaseCustomFieldValue } from '#src/custom-field-value.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'
import type { TimestampCustomFieldTypeContract } from './timestamp.contract.js'

export type TimestampCustomFieldValue = BaseCustomFieldValue<CustomFieldType.TIMESTAMP, TimestampCustomFieldTypeContract['value']>
export type TimestampCustomFieldColumnValue = BaseCustomFieldValue<CustomFieldType.TIMESTAMP, TimestampCustomFieldTypeContract['columnValue']>
