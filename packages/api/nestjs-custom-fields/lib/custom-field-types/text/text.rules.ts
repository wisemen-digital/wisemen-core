import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'
import type { TextCustomFieldTypeContract } from './text.contract.js'

export type TextCustomFieldRules = { type: CustomFieldType.TEXT } & TextCustomFieldTypeContract['rules']
