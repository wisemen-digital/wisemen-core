import type { BooleanCustomFieldTypeContract } from '#src/custom-field-types/boolean/boolean.contract.js'
import type { DateCustomFieldTypeContract } from '#src/custom-field-types/date/date.contract.js'
import type { MonetaryCustomFieldTypeContract } from '#src/custom-field-types/monetary/monetary.contract.js'
import type { MultiSelectCustomFieldTypeContract } from '#src/custom-field-types/multi-select/multi-select.contract.js'
import type { NumberCustomFieldTypeContract } from '#src/custom-field-types/number/number.contract.js'
import type { SingleSelectCustomFieldTypeContract } from '#src/custom-field-types/single-select/single-select.contract.js'
import type { TextArrayCustomFieldTypeContract } from '#src/custom-field-types/text-array/text-array.contract.js'
import type { TextCustomFieldTypeContract } from '#src/custom-field-types/text/text.contract.js'
import type { TimestampCustomFieldTypeContract } from '#src/custom-field-types/timestamp/timestamp.contract.js'
import { CustomFieldType } from './enum/custom-field-type.enum.js'

type Satisfies<T extends U, U> = T

export type CustomFieldRulesMode = 'required' | 'optional' | 'none'
export type CustomFieldChoicesMode = 'required' | 'none'

export interface CustomFieldTypeContractBase {
  value: unknown
  columnValue: unknown
  rules: unknown
  rulesMode: CustomFieldRulesMode
  choicesMode: CustomFieldChoicesMode
}

export type DefineContract<T extends CustomFieldTypeContractBase & Record<Exclude<keyof T, keyof CustomFieldTypeContractBase>, never>> = T

export type CustomFieldTypeContract = Satisfies<
  {
    [CustomFieldType.TEXT]: TextCustomFieldTypeContract
    [CustomFieldType.TEXT_ARRAY]: TextArrayCustomFieldTypeContract
    [CustomFieldType.NUMBER]: NumberCustomFieldTypeContract
    [CustomFieldType.BOOLEAN]: BooleanCustomFieldTypeContract
    [CustomFieldType.TIMESTAMP]: TimestampCustomFieldTypeContract
    [CustomFieldType.DATE]: DateCustomFieldTypeContract
    [CustomFieldType.SINGLE_SELECT]: SingleSelectCustomFieldTypeContract
    [CustomFieldType.MULTI_SELECT]: MultiSelectCustomFieldTypeContract
    [CustomFieldType.MONETARY]: MonetaryCustomFieldTypeContract
  },
  Record<CustomFieldType, CustomFieldTypeContractBase>
>

export type CustomFieldDomainValueByType<T extends CustomFieldType> = CustomFieldTypeContract[T]['value']
export type CustomFieldColumnValueByType<T extends CustomFieldType> = CustomFieldTypeContract[T]['columnValue']
export type CustomFieldRuleConfigByType<T extends CustomFieldType> = CustomFieldTypeContract[T]['rules']
export type CustomFieldRulesModeByType<T extends CustomFieldType> = CustomFieldTypeContract[T]['rulesMode']
export type CustomFieldChoicesModeByType<T extends CustomFieldType> = CustomFieldTypeContract[T]['choicesMode']
