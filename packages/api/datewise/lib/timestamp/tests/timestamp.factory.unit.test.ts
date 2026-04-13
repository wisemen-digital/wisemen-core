import { before, describe, it } from 'node:test'
import { expect } from 'expect'
import { initDayjs } from '../../common/init-dayjs.js'
import { plainDate } from '../../plain-date/index.js'
import { plainTime } from '../../plain-time/plain-time-entry.js'
import { timestamp } from '../index.js'

describe('Timestamp factory', () => {
  before(() => initDayjs())

  it('Creates a timestamp from a plain date, plain time and timezone', () => {
    const date = plainDate('2025-11-23')
    const time = plainTime('14:33:12')
    const ts = timestamp(date, time, 'Europe/Brussels')

    expect(ts.toISOString()).toBe('2025-11-23T13:33:12.000Z')
  })
})
