import { before, describe, it } from 'node:test'
import { expect } from 'expect'
import dayjs from 'dayjs'
import { WiseDate } from '#src/wise-date.js'
import { initDayjs } from '#src/init-dayjs.js'

describe('WiseDate', () => {
  before(() => initDayjs())

  describe('constructor', () => {
    it('defaults to today', () => {
      expect(new WiseDate().isSame(WiseDate.today())).toBe(true)
    })

    it('constructs a date from dayjs', () => {
      expect(() => new WiseDate(dayjs())).not.toThrow()
    })

    it('constructs a date from Date', () => {
      expect(() => new WiseDate(new Date())).not.toThrow()
    })

    it('constructs a date from a string', () => {
      expect(() => new WiseDate('2022-01-01', 'YYYY-MM-DD')).not.toThrow()
      expect(() => new WiseDate('2022-01-01')).not.toThrow()

      expect(() => new WiseDate('not a date string', 'YYYY-MM-DD')).toThrow()
      expect(() => new WiseDate('not a date string')).toThrow()
    })

    it('constructs a date from a plain time object', () => {
      expect(dayjs('2022-02-31', 'YYYY-MM-DD', true).isValid()).toBe(false)
      expect(() => new WiseDate({ year: 2022, month: 1, day: 1 })).not.toThrow()
      expect(() => new WiseDate({ year: 2022, month: 2, day: 30 })).toThrow()
    })

    it('constructs a date from a number', () => {
      expect(() => new WiseDate(0)).not.toThrow()
    })

    it('throws when a date is constructed from infinity', () => {
      expect(() => new WiseDate(Infinity)).toThrow()
      expect(() => new WiseDate(-Infinity)).toThrow()
    })

    it('throws when a date is constructed from NaN', () => {
      expect(() => new WiseDate(NaN)).toThrow()
    })
  })
})
