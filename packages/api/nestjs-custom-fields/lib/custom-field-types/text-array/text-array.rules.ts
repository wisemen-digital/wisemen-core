import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'
import type { TextArrayCustomFieldTypeContract } from './text-array.contract.js'

export type TextArrayCustomFieldRules = { type: CustomFieldType.TEXT_ARRAY } & TextArrayCustomFieldTypeContract['rules']
