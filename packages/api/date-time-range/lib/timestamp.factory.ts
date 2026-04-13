import { DayjsTimestamp } from './dayjs-timestamp.js'
import { PastInfinity } from './past-infinity.js'
import { FutureInfinity } from './future-infinity.js'
import { Timestamp, TimestampInput } from './timestamp.js'

export function timestamp (): Timestamp
export function timestamp (date: undefined): Timestamp
export function timestamp (date: null): null
export function timestamp (date: string): Timestamp
export function timestamp (date: number): Timestamp
export function timestamp (date: Date): Timestamp
export function timestamp (date: Timestamp): Timestamp
export function timestamp (date?: number | Date | string | null): Timestamp | null
export function timestamp (date?: Timestamp | null): Timestamp | null
export function timestamp (date?: number | Date | string | null): Timestamp | null
export function timestamp (date: TimestampInput): Timestamp
export function timestamp (date?: Timestamp | number | Date | string | null): Timestamp | null {
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
    default: return new DayjsTimestamp(date)
  }
}
