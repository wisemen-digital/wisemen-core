import { before, describe, it } from 'node:test'
import { expect } from 'expect'
import { initDayjs } from '../../common/init-dayjs.js'
import { DateTimeRange } from '../../date-time-range/date-time-range.js'
import { timestamp } from '../../timestamp/index.js'
import { rrule } from '../index.js'

describe('RRule once unit tests', () => {
  before(() => {
    initDayjs()
  })

  it('generates the same range from the rule as the input range', () => {
    const range = new DateTimeRange(timestamp(), timestamp().add(8, 'hours'))
    const rule = rrule.once(range)

    const occurrences = Array.from(rule.occurrences())

    expect(occurrences).toHaveLength(1)

    expect(occurrences[0].isSame(range)).toBe(true)
  })
})
