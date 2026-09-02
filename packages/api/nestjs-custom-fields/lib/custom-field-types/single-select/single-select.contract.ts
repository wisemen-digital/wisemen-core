import type { DefineContract } from '#src/custom-field-type-contract.js'

export type SingleSelectCustomFieldTypeContract = DefineContract<{
  value: string
  columnValue: string
  rules: Record<never, never>
  rulesMode: 'none'
  choicesMode: 'required'
}>
