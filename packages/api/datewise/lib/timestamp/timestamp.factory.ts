import { PlainDate } from '../plain-date/plain-date.js'
import { FutureInfinityDate } from '../plain-date/future-infinity-date.js'
import { PastInfinityDate } from '../plain-date/past-infinity-date.js'
import { PlainTime } from '../plain-time/plain-time.js'
import { TimezoneInput } from '../common/timezone.js'
import { DayjsTimestamp } from './dayjs-timestamp.js'
import { PastInfinity } from './past-infinity.js'
import { FutureInfinity } from './future-infinity.js'
import { Timestamp, TimestampInput } from './timestamp.js'

export function factory (): Timestamp
export function factory (date: undefined): Timestamp
export function factory (date: null): null
export function factory (date: string): Timestamp
export function factory (date: number): Timestamp
export function factory (date: Date): Timestamp
export function factory (date: Timestamp): Timestamp
export function factory (date: PlainDate): Timestamp
export function factory (date: PlainDate | null): Timestamp | null
export function factory (date: PlainDate, time: PlainTime, tz: TimezoneInput): Timestamp | null
export function factory (date?: number | Date | string | null): Timestamp | null
export function factory (date?: Timestamp | null): Timestamp | null
export function factory (date?: number | Date | string | null): Timestamp | null
export function factory (date: TimestampInput): Timestamp
export function factory (
  date?: TimestampInput | null,
  time?: PlainTime,
  tz?: TimezoneInput
): Timestamp | null {
  if (
    date instanceof DayjsTimestamp
    || date instanceof FutureInfinity
    || date instanceof PastInfinity
  ) {
    return date
  }

  switch (date) {
    case null: return null
    case undefined: return new DayjsTimestamp()
    case '-infinity': return new PastInfinity()
    case 'infinity': return new FutureInfinity()
    case '+infinity': return new FutureInfinity()
    case Infinity: return new FutureInfinity()
    case -Infinity: return new PastInfinity()
    default: {
      if (
        date instanceof DayjsTimestamp
        || date instanceof FutureInfinity
        || date instanceof PastInfinity
      ) {
        return date
      }

      if (date instanceof FutureInfinityDate) {
        return new FutureInfinity()
      }

      if (date instanceof PastInfinityDate) {
        return new PastInfinity()
      }

      return new DayjsTimestamp(date, time, tz)
    }
  }
}
