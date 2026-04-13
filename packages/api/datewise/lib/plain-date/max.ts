import { factory } from './plain-date.factory.js'
import { PlainDate, PlainDateInput } from './plain-date.js'

export function max (...dates: PlainDateInput[]): PlainDate {
  if (dates.length === 0) {
    throw new Error('Invalid arguments, no dates provided to compare')
  }

  const plainDates = dates.map(t => factory(t))

  let max = factory(plainDates[0])

  for (let i = 1; i < plainDates.length; i++) {
    if (plainDates[i].isAfter(max)) {
      max = plainDates[i]
    }
  }

  return max
}
