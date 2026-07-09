import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'
import type { NumberCustomFieldTypeContract } from './number.contract.js'

export type NumberCustomFieldRules = { type: CustomFieldType.NUMBER } & NumberCustomFieldTypeContract['rules']
