import type { DefineContract } from '#src/custom-field-type-contract.js'

export type MultiSelectCustomFieldTypeContract = DefineContract<{
  value: string[]
  columnValue: string[]
  rules: {
    minSelections?: number
    maxSelections?: number
  }
  rulesMode: 'optional'
  choicesMode: 'required'
}>
