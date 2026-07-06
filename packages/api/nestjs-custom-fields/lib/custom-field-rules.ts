import { CustomFieldType } from './enum/custom-field-type.enum.js'
import type { CustomFieldRuleConfigByType } from './custom-field-type-contract.js'

type CustomFieldRulesFor<T extends CustomFieldType> = { type: T } & CustomFieldRuleConfigByType<T>

export type TextCustomFieldRules = CustomFieldRulesFor<CustomFieldType.TEXT>
export type TextArrayCustomFieldRules = CustomFieldRulesFor<CustomFieldType.TEXT_ARRAY>
export type NumberCustomFieldRules = CustomFieldRulesFor<CustomFieldType.NUMBER>
export type BooleanCustomFieldRules = CustomFieldRulesFor<CustomFieldType.BOOLEAN>
export type DateCustomFieldRules = CustomFieldRulesFor<CustomFieldType.DATE>
export type TimestampCustomFieldRules = CustomFieldRulesFor<CustomFieldType.TIMESTAMP>
export type SelectCustomFieldRules = CustomFieldRulesFor<CustomFieldType.SINGLE_SELECT>
export type MultiSelectCustomFieldRules = CustomFieldRulesFor<CustomFieldType.MULTI_SELECT>
export type MonetaryCustomFieldRules = CustomFieldRulesFor<CustomFieldType.MONETARY>

export type CustomFieldRulesByType<T extends CustomFieldType> = CustomFieldRulesFor<T>

export type CustomFieldRules = {
  [T in CustomFieldType]: CustomFieldRulesByType<T>
}[CustomFieldType]
