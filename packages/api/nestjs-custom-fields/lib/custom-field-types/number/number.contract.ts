import type { DefineContract } from '#src/custom-field-type-contract.js'

export type NumberCustomFieldTypeContract = DefineContract<{
  value: number
  columnValue: number
  rules: {
    min?: number
    max?: number
  }
  rulesMode: 'optional'
  choicesMode: 'none'
}>
