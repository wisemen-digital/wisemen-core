import type { BaseCustomFieldValue } from '#src/custom-field-value.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'
import type { MultiSelectCustomFieldTypeContract } from './multi-select.contract.js'

export type MultiSelectCustomFieldValue = BaseCustomFieldValue<CustomFieldType.MULTI_SELECT, MultiSelectCustomFieldTypeContract['value']>
export type MultiSelectCustomFieldColumnValue = BaseCustomFieldValue<CustomFieldType.MULTI_SELECT, MultiSelectCustomFieldTypeContract['columnValue']>
