import type { DefineContract } from '#src/custom-field-type-contract.js'
import type { Currency, Monetary, MonetaryJSON } from '@wisemen/monetary'

export type MonetaryCustomFieldTypeContract = DefineContract<{
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
}>
