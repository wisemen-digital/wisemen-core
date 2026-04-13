import { before, describe, it } from 'node:test'
import { expect } from 'expect'
import { FutureInfinity } from '../future-infinity.js'
import { PastInfinity } from '../past-infinity.js'
import { timestamp } from '../index.js'
import { initDayjs } from '../../common/init-dayjs.js'

describe('FutureInfinity timestamp', () => {
  before(() => initDayjs())

  describe('until', () => {
    it('returns zero duration when compared to itself', () => {
      const futureInfinity = new FutureInfinity()
      const duration = futureInfinity.until(futureInfinity)

      expect(duration.milliseconds).toBe(0)
    })

    it('returns negative infinity when compared to a regular timestamp', () => {
      const futureInfinity = new FutureInfinity()
      const regular = timestamp('2025-01-01T00:00:00Z')
      const duration = futureInfinity.until(regular)

      expect(duration.milliseconds).toBe(-Infinity)
    })

    it('returns negative infinity when compared to PastInfinity', () => {
      const futureInfinity = new FutureInfinity()
      const pastInfinity = new PastInfinity()
      const duration = futureInfinity.until(pastInfinity)

      expect(duration.milliseconds).toBe(-Infinity)
    })
  })

  describe('since', () => {
    it('returns zero duration when compared to itself', () => {
      const futureInfinity = new FutureInfinity()
      const duration = futureInfinity.since(futureInfinity)

      expect(duration.milliseconds).toBe(0)
    })

    it('returns positive infinity when compared to a regular timestamp', () => {
      const futureInfinity = new FutureInfinity()
      const regular = timestamp('2025-01-01T00:00:00Z')
      const duration = futureInfinity.since(regular)

      expect(duration.milliseconds).toBe(Infinity)
    })

    it('returns positive infinity when compared to PastInfinity', () => {
      const futureInfinity = new FutureInfinity()
      const pastInfinity = new PastInfinity()
      const duration = futureInfinity.since(pastInfinity)

      expect(duration.milliseconds).toBe(Infinity)
    })
  })
})
