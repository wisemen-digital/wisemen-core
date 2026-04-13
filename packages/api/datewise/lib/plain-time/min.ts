import { plainTime } from './plain-time-entry.js'
import { PlainTimeInput, PlainTime } from './plain-time.js'

export function min (...dates: PlainTimeInput[]): PlainTime {
  if (dates.length === 0) {
    throw new Error('Invalid arguments, no dates provided to compare')
  }

  const plainTimes = dates.map(t => plainTime(t))

  let min = plainTime(plainTimes[0])

  for (let i = 1; i < plainTimes.length; i++) {
    if (plainTimes[i].isBefore(min)) {
      min = plainTimes[i]
    }
  }

  return min
}
