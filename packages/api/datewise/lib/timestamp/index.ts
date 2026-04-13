import { Dayjs } from 'dayjs'
import { TimezoneInput } from '../common/timezone.js'
import { PlainDate } from '../plain-date/plain-date.js'
import { PlainTime } from '../plain-time/plain-time.js'
import { max } from './max.js'
import { min } from './min.js'
import { factory } from './timestamp.factory.js'
import { Timestamp, TimestampInput } from './timestamp.js'
import { FutureInfinity } from './future-infinity.js'
import { PastInfinity } from './past-infinity.js'

export * from './typeorm/index.js'
export * from './api-property/index.js'
export * from './timestamp.js'
export * from './validators/index.js'

export interface TimestampFn {
  (): Timestamp
  (date: undefined): Timestamp
  (date: null): null
  (date: string): Timestamp
  (date: number): Timestamp
  (date: Date): Timestamp
  (date: Timestamp): Timestamp
  (date: Dayjs): Timestamp
  (date?: number | Date | string | null): Timestamp | null
  (date?: Timestamp | null): Timestamp | null
  (date?: number | Date | string | null): Timestamp | null
  (date: TimestampInput): Timestamp
  (date?: TimestampInput | null): Timestamp | null
  (date: PlainDate, time: PlainTime, tz?: TimezoneInput): Timestamp

  futureInfinity(): Timestamp
  pastInfinity(): Timestamp
  max (...times: TimestampInput[]): Timestamp
  min (...times: TimestampInput[]): Timestamp
}

export const timestamp = factory as unknown as TimestampFn

timestamp.futureInfinity = () => new FutureInfinity()
timestamp.pastInfinity = () => new PastInfinity()
timestamp.max = max
timestamp.min = min
