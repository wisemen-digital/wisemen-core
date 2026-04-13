import { factory } from './plain-date.factory.js'
import { plainDate } from './plain-date.fn.js'
import { PlainDate, PlainDateInput } from './plain-date.js'

export function min (...dates: PlainDateInput[]): PlainDate {
  if (dates.length === 0) {
    throw new Error('Invalid arguments, no dates provided to compare')
  }

  const plainDates = dates.map(t => plainDate(t))

  let min = factory(plainDates[0])

  for (let i = 1; i < plainDates.length; i++) {
    if (plainDates[i].isBefore(min)) {
      min = plainDates[i]
    }
  }

  return min
}
