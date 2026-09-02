import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'
import type { SingleSelectCustomFieldTypeContract } from './single-select.contract.js'

export type SelectCustomFieldRules = { type: CustomFieldType.SINGLE_SELECT } & SingleSelectCustomFieldTypeContract['rules']
