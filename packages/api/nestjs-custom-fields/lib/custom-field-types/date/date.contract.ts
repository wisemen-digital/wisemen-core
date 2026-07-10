import type { PlainDate } from '@wisemen/datewise'
import type { DefineContract } from '#src/custom-field-type-contract.js'

export type DateCustomFieldTypeContract = DefineContract<{
  value: PlainDate
  columnValue: string
  rules: {
    minDate?: string
    maxDate?: string
  }
  rulesMode: 'optional'
  choicesMode: 'none'
}>
