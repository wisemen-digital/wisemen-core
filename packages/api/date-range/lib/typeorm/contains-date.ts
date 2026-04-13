import { randomUUID } from 'crypto'
import { FindOperator, Raw } from 'typeorm'
import { WiseDate } from '@wisemen/wise-date'
import { DateRange } from '#src/date-range.js'

export function ContainsDate (date: WiseDate): FindOperator<DateRange> {
  const paramName = randomUUID().replaceAll('-', '')

  return Raw((alias: string) => `${alias} @> :${paramName}::date`, { [paramName]: date.toString() }) as FindOperator<DateRange>
}
