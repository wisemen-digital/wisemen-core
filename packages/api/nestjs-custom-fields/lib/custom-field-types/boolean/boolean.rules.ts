import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'
import type { BooleanCustomFieldTypeContract } from './boolean.contract.js'

export type BooleanCustomFieldRules = { type: CustomFieldType.BOOLEAN } & BooleanCustomFieldTypeContract['rules']
