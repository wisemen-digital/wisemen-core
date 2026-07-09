import type { Timestamp } from '@wisemen/datewise'
import type { DefineContract } from '#src/custom-field-type-contract.js'

export type TimestampCustomFieldTypeContract = DefineContract<{
  value: Timestamp
  columnValue: string
  rules: {
    minDate?: string
    maxDate?: string
  }
  rulesMode: 'optional'
  choicesMode: 'none'
}>
