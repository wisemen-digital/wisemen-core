import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'
import type { DateCustomFieldTypeContract } from './date.contract.js'

export type DateCustomFieldRules = { type: CustomFieldType.DATE } & DateCustomFieldTypeContract['rules']
