import { Timestamp, TimestampInput } from './timestamp.js'
import { timestamp } from './index.js'

export function min (...timestamps: TimestampInput[]): Timestamp {
  if (timestamps.length === 0) {
    throw new Error('Invalid arguments, no dates provided to compare')
  }

  const stamps = timestamps.map(t => timestamp(t))

  let min = timestamp(stamps[0])

  for (let i = 1; i < stamps.length; i++) {
    if (stamps[i].isBefore(min)) {
      min = stamps[i]
    }
  }

  return min
}
