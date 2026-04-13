import { randomUUID } from 'crypto'
import { FindOperator, Raw } from 'typeorm'
import { WiseDate } from '@wisemen/wise-date'
import { DateRange } from '#src/date-range.js'

export function StrictlyLeftOf (date: WiseDate): FindOperator<DateRange> {
  const paramName = randomUUID().replaceAll('-', '')
  const dateRange = new DateRange(date, date)

  return Raw((alias: string) => `${alias} << :${paramName}`, { [paramName]: dateRange.toString() }) as FindOperator<DateRange>
}
