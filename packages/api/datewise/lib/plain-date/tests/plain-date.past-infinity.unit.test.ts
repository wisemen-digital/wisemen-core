import { before, describe, it } from 'node:test'
import { expect } from 'expect'
import { PastInfinityDate } from '../past-infinity-date.js'
import { DayjsPlainDate } from '../dayjs-plain-date.js'
import { FutureInfinityDate } from '../future-infinity-date.js'
import { initDayjs } from '../../common/init-dayjs.js'
import { plainDate } from '../index.js'

describe('PastInfinityDate', () => {
  before(() => initDayjs())

  describe('until', () => {
    it('returns zero duration when compared to itself', () => {
      const pastInfinity = new PastInfinityDate()
      const duration = pastInfinity.until(pastInfinity)

      expect(duration.days).toBe(0)
    })

    it('returns zero duration when compared to another PastInfinityDate', () => {
      const pastInfinity1 = new PastInfinityDate()
      const pastInfinity2 = new PastInfinityDate()
      const duration = pastInfinity1.until(pastInfinity2)

      expect(duration.days).toBe(0)
    })

    it('returns positive infinity when compared to a regular date', () => {
      const pastInfinity = new PastInfinityDate()
      const regularDate = new DayjsPlainDate('2024-01-01')
      const duration = pastInfinity.until(regularDate)

      expect(duration.days).toBe(Infinity)
    })

    it('returns positive infinity when compared to today', () => {
      const pastInfinity = new PastInfinityDate()
      const duration = pastInfinity.until(plainDate.today())

      expect(duration.days).toBe(Infinity)
    })

    it('returns positive infinity when compared to FutureInfinityDate', () => {
      const pastInfinity = new PastInfinityDate()
      const futureInfinity = new FutureInfinityDate()
      const duration = pastInfinity.until(futureInfinity)

      expect(duration.days).toBe(Infinity)
    })

    it('returns positive infinity when compared to a future date', () => {
      const pastInfinity = new PastInfinityDate()
      const futureDate = new DayjsPlainDate().add(100, 'day')
      const duration = pastInfinity.until(futureDate)

      expect(duration.days).toBe(Infinity)
    })
  })

  describe('since', () => {
    it('returns zero duration when compared to itself', () => {
      const pastInfinity = new PastInfinityDate()
      const duration = pastInfinity.since(pastInfinity)

      expect(duration.days).toBe(0)
    })

    it('returns zero duration when compared to another PastInfinityDate', () => {
      const pastInfinity1 = new PastInfinityDate()
      const pastInfinity2 = new PastInfinityDate()
      const duration = pastInfinity1.since(pastInfinity2)

      expect(duration.days).toBe(0)
    })

    it('returns negative infinity when compared to a regular date', () => {
      const pastInfinity = new PastInfinityDate()
      const regularDate = new DayjsPlainDate('2024-01-01')
      const duration = pastInfinity.since(regularDate)

      expect(duration.days).toBe(-Infinity)
    })

    it('returns negative infinity when compared to today', () => {
      const pastInfinity = new PastInfinityDate()
      const duration = pastInfinity.since(plainDate.today())

      expect(duration.days).toBe(-Infinity)
    })

    it('returns negative infinity when compared to FutureInfinityDate', () => {
      const pastInfinity = new PastInfinityDate()
      const futureInfinity = new FutureInfinityDate()
      const duration = pastInfinity.since(futureInfinity)

      expect(duration.days).toBe(-Infinity)
    })

    it('returns negative infinity when compared to a future date', () => {
      const pastInfinity = new PastInfinityDate()
      const futureDate = new DayjsPlainDate().add(100, 'day')
      const duration = pastInfinity.since(futureDate)

      expect(duration.days).toBe(-Infinity)
    })
  })
})
