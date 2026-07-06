import type { Currency, Monetary, MonetaryJSON } from '@wisemen/monetary'
import { CustomFieldType } from './enum/custom-field-type.enum.js'
import { PlainDate, Timestamp } from '@wisemen/datewise'

export type CustomFieldRulesMode = 'required' | 'optional' | 'none'
export type CustomFieldChoicesMode = 'required' | 'none'

export type CustomFieldTypeContract = {
  [CustomFieldType.TEXT]: {
    value: string
    columnValue: string
    rules: {
      minLength?: number
      maxLength?: number
      regex?: string
    }
    rulesMode: 'optional'
    choicesMode: 'none'
  }
  [CustomFieldType.TEXT_ARRAY]: {
    value: string[]
    columnValue: string[]
    rules: {
      minItems?: number
      maxItems?: number
    }
    rulesMode: 'optional'
    choicesMode: 'none'
  }
  [CustomFieldType.NUMBER]: {
    value: number
    columnValue: number
    rules: {
      min?: number
      max?: number
    }
    rulesMode: 'optional'
    choicesMode: 'none'
  }
  [CustomFieldType.BOOLEAN]: {
    value: boolean
    columnValue: boolean
    rules: {}
    rulesMode: 'none'
    choicesMode: 'none'
  }
  [CustomFieldType.TIMESTAMP]: {
    value: Timestamp
    columnValue: string
    rules: {
      minDate?: string
      maxDate?: string
    }
    rulesMode: 'optional'
    choicesMode: 'none'
  }
  [CustomFieldType.DATE]: {
    value: PlainDate
    columnValue: string
    rules: {
      minDate?: string
      maxDate?: string
    }
    rulesMode: 'optional'
    choicesMode: 'none'
  }
  [CustomFieldType.SINGLE_SELECT]: {
    value: string
    columnValue: string
    rules: {}
    rulesMode: 'none'
    choicesMode: 'required'
  }
  [CustomFieldType.MULTI_SELECT]: {
    value: string[]
    columnValue: string[]
    rules: {
      minSelections?: number
      maxSelections?: number
    }
    rulesMode: 'optional'
    choicesMode: 'required'
  }
  [CustomFieldType.MONETARY]: {
    value: Monetary<Currency>
    columnValue: MonetaryJSON
    rules: {
      precision: number
      currencies?: Currency[]
      min?: number
      max?: number
    }
    rulesMode: 'required'
    choicesMode: 'none'
  }
}

export type CustomFieldDomainValueByType<T extends CustomFieldType> = CustomFieldTypeContract[T]['value']
export type CustomFieldColumnValueByType<T extends CustomFieldType> = CustomFieldTypeContract[T]['columnValue']
export type CustomFieldRuleConfigByType<T extends CustomFieldType> = CustomFieldTypeContract[T]['rules']
export type CustomFieldRulesModeByType<T extends CustomFieldType> = CustomFieldTypeContract[T]['rulesMode']
export type CustomFieldChoicesModeByType<T extends CustomFieldType> = CustomFieldTypeContract[T]['choicesMode']
