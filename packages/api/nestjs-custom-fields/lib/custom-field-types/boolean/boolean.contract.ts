import type { DefineContract } from '#src/custom-field-type-contract.js'

export type BooleanCustomFieldTypeContract = DefineContract<{
  value: boolean
  columnValue: boolean
  rules: Record<never, never>
  rulesMode: 'none'
  choicesMode: 'none'
}>
