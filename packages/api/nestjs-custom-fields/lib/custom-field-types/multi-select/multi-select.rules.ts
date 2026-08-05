import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'
import type { MultiSelectCustomFieldTypeContract } from './multi-select.contract.js'

export type MultiSelectCustomFieldRules = { type: CustomFieldType.MULTI_SELECT } & MultiSelectCustomFieldTypeContract['rules']
