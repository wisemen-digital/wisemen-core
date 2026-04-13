import dayjs from 'dayjs'
import { FutureInfinity } from '../timestamp/future-infinity.js'
import { PastInfinity } from '../timestamp/past-infinity.js'
import { DayjsPlainDate } from './dayjs-plain-date.js'
import { PastInfinityDate } from './past-infinity-date.js'
import { FutureInfinityDate } from './future-infinity-date.js'
import { PlainDate, PlainDateInput } from './plain-date.js'

export function factory (): DayjsPlainDate
export function factory (date: undefined): DayjsPlainDate
export function factory (date: null): null
export function factory (date: string, format?: string): DayjsPlainDate
export function factory (date: number): DayjsPlainDate
export function factory (date: Date): DayjsPlainDate
export function factory (date: 'infinity' | '+infinity'): FutureInfinityDate
export function factory (date: '-infinity'): PastInfinityDate
export function factory (date: PlainDateInput): PlainDate
export function factory (date?: PlainDateInput | null, format?: string): PlainDate | null {
  switch (date) {
    case null: return null
    case undefined: return new DayjsPlainDate()
    case '-infinity': return new PastInfinityDate()
    case 'infinity': return new FutureInfinityDate()
    case '+infinity': return new FutureInfinityDate()
    case Infinity: return new FutureInfinityDate()
    case -Infinity: return new PastInfinityDate()
    default: {
      if (
        date instanceof FutureInfinityDate
        || date instanceof PastInfinityDate
        || date instanceof DayjsPlainDate
      ) {
        return date
      }

      if (date instanceof FutureInfinity) {
        return new FutureInfinityDate()
      }

      if (date instanceof PastInfinity) {
        return new PastInfinityDate()
      }

      return new DayjsPlainDate(date, format)
    }
  }
}

export function today (): PlainDate {
  return new DayjsPlainDate()
}

export function tomorrow (): PlainDate {
  return new DayjsPlainDate(dayjs().add(1, 'day'))
}

export function yesterday (): PlainDate {
  return new DayjsPlainDate(dayjs().subtract(1, 'day'))
}
