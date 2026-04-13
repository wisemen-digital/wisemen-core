import { randomUUID } from 'crypto'
import { FindOperator, Raw } from 'typeorm'
import { DateTimeRange } from '#src/date-time-range.js'
import { DayjsTimestamp } from '#src/dayjs-timestamp.js'

export function StrictlyLeftOf (date: Date): FindOperator<DateTimeRange> {
  const paramName = randomUUID().replaceAll('-', '')
  const dateRange = new DateTimeRange(new DayjsTimestamp(date), new DayjsTimestamp(date))

  return Raw((alias: string) => `${alias} << :${paramName}`, { [paramName]: dateRange.toString() }) as FindOperator<DateTimeRange>
}
