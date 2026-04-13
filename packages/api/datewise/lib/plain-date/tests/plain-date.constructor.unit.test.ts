import { before, describe, it } from 'node:test'
import { expect } from 'expect'
import dayjs from 'dayjs'
import { DayjsPlainDate } from '../dayjs-plain-date.js'
import { initDayjs } from '../../common/init-dayjs.js'
import { plainDate } from '../index.js'

describe('PlainDate constructor', () => {
  before(() => initDayjs())

  it('defaults to today', () => {
    expect(new DayjsPlainDate().isSame(plainDate.today())).toBe(true)
  })

  it('constructs a date from dayjs', () => {
    expect(() => new DayjsPlainDate(dayjs())).not.toThrow()
  })

  it('constructs a date from Date', () => {
    expect(() => new DayjsPlainDate(new Date())).not.toThrow()
  })

  it('constructs a date from a string', () => {
    expect(() => new DayjsPlainDate('2022-01-01', 'YYYY-MM-DD')).not.toThrow()
    expect(() => new DayjsPlainDate('2022-01-01')).not.toThrow()

    expect(() => new DayjsPlainDate('not a date string', 'YYYY-MM-DD')).toThrow()
    expect(() => new DayjsPlainDate('not a date string')).toThrow()
  })

  it('constructs a date from a plain time object', () => {
    expect(dayjs('2022-02-31', 'YYYY-MM-DD', true).isValid()).toBe(false)
    expect(() => new DayjsPlainDate({ year: 2022, month: 1, day: 1 })).not.toThrow()
    expect(() => new DayjsPlainDate({ year: 2022, month: 2, day: 30 })).toThrow()
  })

  it('constructs a date from a number', () => {
    expect(() => new DayjsPlainDate(0)).not.toThrow()
  })

  it('throws when a date is constructed from infinity', () => {
    expect(() => new DayjsPlainDate(Infinity)).toThrow()
    expect(() => new DayjsPlainDate(-Infinity)).toThrow()
  })

  it('throws when a date is constructed from NaN', () => {
    expect(() => new DayjsPlainDate(NaN)).toThrow()
  })
})
