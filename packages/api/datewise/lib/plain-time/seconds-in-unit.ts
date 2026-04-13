import { SECONDS_PER_HOUR, SECONDS_PER_MINUTE } from '../common/constants.js'

export const SECONDS_IN_UNIT = {
  second: 1,
  seconds: 1,
  s: 1,
  minute: SECONDS_PER_MINUTE,
  minutes: SECONDS_PER_MINUTE,
  m: SECONDS_PER_MINUTE,
  hour: SECONDS_PER_HOUR,
  hours: SECONDS_PER_HOUR,
  h: SECONDS_PER_HOUR
} as const
