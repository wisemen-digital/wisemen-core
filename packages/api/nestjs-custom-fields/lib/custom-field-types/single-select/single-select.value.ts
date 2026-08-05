import type { BaseCustomFieldValue } from '#src/custom-field-value.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'
import type { SingleSelectCustomFieldTypeContract } from './single-select.contract.js'

export type SingleSelectCustomFieldValue = BaseCustomFieldValue<CustomFieldType.SINGLE_SELECT, SingleSelectCustomFieldTypeContract['value']>
export type SingleSelectCustomFieldColumnValue = BaseCustomFieldValue<CustomFieldType.SINGLE_SELECT, SingleSelectCustomFieldTypeContract['columnValue']>
