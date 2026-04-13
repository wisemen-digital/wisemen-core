import { FindOperator, JsonContains } from 'typeorm'
import { Monetary } from './monetary.js'
import { Currency } from './currency.enum.js'
import { MonetaryJSON } from './monetary.column.js'

type MonetaryContainsOptions = {
  amount?: FindOperator<MonetaryJSON['amount']> | MonetaryJSON['amount']
  currency?: FindOperator<MonetaryJSON['currency']> | MonetaryJSON['currency']
}

export function MonetaryContains<C extends Currency> (
  value: MonetaryContainsOptions
): FindOperator<Monetary<C>> {
  return JsonContains(value) as FindOperator<Monetary<C>>
}
