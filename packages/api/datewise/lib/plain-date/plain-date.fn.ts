import { FutureInfinityDate } from './future-infinity-date.js'
import { max } from './max.js'
import { min } from './min.js'
import { PastInfinityDate } from './past-infinity-date.js'
import { factory, today, tomorrow, yesterday } from './plain-date.factory.js'
import { PlainDate, PlainDateInput } from './plain-date.js'

export interface PlainDateFn {
  (): PlainDate
  (arg: null): null
  (arg: undefined): PlainDate
  (arg: PlainDateInput): PlainDate
  (arg: PlainDateInput | null): PlainDate
  (arg: string, format: string): PlainDate

  today(): PlainDate
  tomorrow(): PlainDate
  yesterday(): PlainDate
  futureInfinity(): PlainDate
  pastInfinity(): PlainDate
  min(...dates: PlainDateInput[]): PlainDate
  max(...dates: PlainDateInput[]): PlainDate
}

export const plainDate = factory as unknown as PlainDateFn

plainDate.today = today
plainDate.tomorrow = tomorrow
plainDate.yesterday = yesterday
plainDate.min = min
plainDate.max = max
plainDate.futureInfinity = () => new FutureInfinityDate()
plainDate.pastInfinity = () => new PastInfinityDate()
