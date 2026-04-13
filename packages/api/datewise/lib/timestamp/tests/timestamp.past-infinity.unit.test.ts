import { before, describe, it } from 'node:test'
import { expect } from 'expect'
import { PastInfinity } from '../past-infinity.js'
import { FutureInfinity } from '../future-infinity.js'
import { timestamp } from '../index.js'
import { initDayjs } from '../../common/init-dayjs.js'

describe('PastInfinity timestamp', () => {
  before(() => initDayjs())

  describe('until', () => {
    it('returns zero duration when compared to itself', () => {
      const pastInfinity = new PastInfinity()
      const duration = pastInfinity.until(pastInfinity)

      expect(duration.milliseconds).toBe(0)
    })

    it('returns positive infinity when compared to a regular timestamp', () => {
      const pastInfinity = new PastInfinity()
      const regular = timestamp('2025-01-01T00:00:00Z')
      const duration = pastInfinity.until(regular)

      expect(duration.milliseconds).toBe(Infinity)
    })

    it('returns positive infinity when compared to FutureInfinity', () => {
      const pastInfinity = new PastInfinity()
      const futureInfinity = new FutureInfinity()
      const duration = pastInfinity.until(futureInfinity)

      expect(duration.milliseconds).toBe(Infinity)
    })
  })

  describe('since', () => {
    it('returns zero duration when compared to itself', () => {
      const pastInfinity = new PastInfinity()
      const duration = pastInfinity.since(pastInfinity)

      expect(duration.milliseconds).toBe(0)
    })

    it('returns negative infinity when compared to a regular timestamp', () => {
      const pastInfinity = new PastInfinity()
      const regular = timestamp('2025-01-01T00:00:00Z')
      const duration = pastInfinity.since(regular)

      expect(duration.milliseconds).toBe(-Infinity)
    })

    it('returns negative infinity when compared to FutureInfinity', () => {
      const pastInfinity = new PastInfinity()
      const futureInfinity = new FutureInfinity()
      const duration = pastInfinity.since(futureInfinity)

      expect(duration.milliseconds).toBe(-Infinity)
    })
  })
})
