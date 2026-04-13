import { plainTime } from './plain-time-entry.js'
import { PlainTimeInput, PlainTime } from './plain-time.js'

export function max (...dates: PlainTimeInput[]): PlainTime {
  if (dates.length === 0) {
    throw new Error('Invalid arguments, no dates provided to compare')
  }

  const plainTimes = dates.map(t => plainTime(t))

  let max = plainTime(plainTimes[0])

  for (let i = 1; i < plainTimes.length; i++) {
    if (plainTimes[i].isAfter(max)) {
      max = plainTimes[i]
    }
  }

  return max
}
