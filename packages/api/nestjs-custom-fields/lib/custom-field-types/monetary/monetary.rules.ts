import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'
import type { MonetaryCustomFieldTypeContract } from './monetary.contract.js'

export type MonetaryCustomFieldRules = { type: CustomFieldType.MONETARY } & MonetaryCustomFieldTypeContract['rules']
