import type { DefineContract } from '#src/custom-field-type-contract.js'

export type TextArrayCustomFieldTypeContract = DefineContract<{
  value: string[]
  columnValue: string[]
  rules: {
    minItems?: number
    maxItems?: number
  }
  rulesMode: 'optional'
  choicesMode: 'none'
}>
