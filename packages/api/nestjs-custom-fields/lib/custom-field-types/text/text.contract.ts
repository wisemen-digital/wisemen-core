import type { DefineContract } from '#src/custom-field-type-contract.js'

export type TextCustomFieldTypeContract = DefineContract<{
  value: string
  columnValue: string
  rules: {
    minLength?: number
    maxLength?: number
    regex?: string
  }
  rulesMode: 'optional'
  choicesMode: 'none'
}>
