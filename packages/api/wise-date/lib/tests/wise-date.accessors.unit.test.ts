import { before, describe, it } from 'node:test'
import { expect } from 'expect'
import { initDayjs } from '#src/init-dayjs.js'
import { wiseDate } from '#src/wise-date.factory.js'

describe('WiseDate accessors', () => {
  before(() => initDayjs())

  describe('day', () => {
    it('returns the day of the week', () => {
      const day = wiseDate('2025-10-12') // sunday

      for (let i = 0; i < 7; i++) {
        expect(day.day() === i)
        day.add(1, 'day')
      }

      expect(day.day()).toBe(0) // wrapped around to sunday
    })

    it('throws when accessing the day of the week of an infinite date', () => {
      expect(() => wiseDate('infinity').day()).toThrow()
      expect(() => wiseDate('-infinity').day()).toThrow()
    })
  })
})
