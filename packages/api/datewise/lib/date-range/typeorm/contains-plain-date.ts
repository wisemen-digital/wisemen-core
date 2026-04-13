import { randomUUID } from 'crypto'
import { FindOperator, Raw } from 'typeorm'
import { DateRange } from '../date-range.js'
import { PlainDateInput } from '../../plain-date/plain-date.js'
import { plainDate } from '../../plain-date/index.js'

export function ContainsPlainDate (date: PlainDateInput): FindOperator<DateRange> {
  const paramName = randomUUID().replaceAll('-', '')

  return Raw(
    (alias: string) => `${alias} @> :${paramName}::date`,
    { [paramName]: plainDate(date).toString() }
  ) as FindOperator<DateRange>
}
