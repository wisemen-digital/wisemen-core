import { CustomFieldType } from './enum/custom-field-type.enum.js'
import type { CustomFieldRuleConfigByType } from './custom-field-type-contract.js'
import type { BooleanCustomFieldRules as BooleanCustomFieldRulesModel } from '#src/custom-field-types/boolean/boolean.rules.js'
import type { DateCustomFieldRules as DateCustomFieldRulesModel } from '#src/custom-field-types/date/date.rules.js'
import type { MonetaryCustomFieldRules as MonetaryCustomFieldRulesModel } from '#src/custom-field-types/monetary/monetary.rules.js'
import type { MultiSelectCustomFieldRules as MultiSelectCustomFieldRulesModel } from '#src/custom-field-types/multi-select/multi-select.rules.js'
import type { NumberCustomFieldRules as NumberCustomFieldRulesModel } from '#src/custom-field-types/number/number.rules.js'
import type { SelectCustomFieldRules as SelectCustomFieldRulesModel } from '#src/custom-field-types/single-select/single-select.rules.js'
import type { TextArrayCustomFieldRules as TextArrayCustomFieldRulesModel } from '#src/custom-field-types/text-array/text-array.rules.js'
import type { TextCustomFieldRules as TextCustomFieldRulesModel } from '#src/custom-field-types/text/text.rules.js'
import type { TimestampCustomFieldRules as TimestampCustomFieldRulesModel } from '#src/custom-field-types/timestamp/timestamp.rules.js'

type CustomFieldRulesFor<T extends CustomFieldType> = { type: T } & CustomFieldRuleConfigByType<T>

export type TextCustomFieldRules = TextCustomFieldRulesModel
export type TextArrayCustomFieldRules = TextArrayCustomFieldRulesModel
export type NumberCustomFieldRules = NumberCustomFieldRulesModel
export type BooleanCustomFieldRules = BooleanCustomFieldRulesModel
export type DateCustomFieldRules = DateCustomFieldRulesModel
export type TimestampCustomFieldRules = TimestampCustomFieldRulesModel
export type SelectCustomFieldRules = SelectCustomFieldRulesModel
export type MultiSelectCustomFieldRules = MultiSelectCustomFieldRulesModel
export type MonetaryCustomFieldRules = MonetaryCustomFieldRulesModel

export type CustomFieldRulesByType<T extends CustomFieldType> = CustomFieldRulesFor<T>

export type CustomFieldRules = {
  [T in CustomFieldType]: CustomFieldRulesByType<T>
}[CustomFieldType]
