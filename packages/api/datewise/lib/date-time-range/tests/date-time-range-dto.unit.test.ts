import { describe, it } from 'node:test'
import { expect } from 'expect'
import { DateTimeRangeDto } from '../date-time-range.dto.js'
import { DateTimeRange } from '../date-time-range.js'
import { timestamp } from '../../timestamp/index.js'

describe('DateTimeRangeDto - Unit Tests', () => {
  describe('from', () => {
    it('returns null if input is null', () => {
      const input = null
      const result = DateTimeRangeDto.from(input)

      expect(result).toBeNull()
    })

    it('returns undefined if input is undefined', () => {
      const input = undefined
      const result = DateTimeRangeDto.from(input)

      expect(result).toBeUndefined()
    })

    it('returns the dto with correct fields if input is a DateTimeRange', () => {
      const input = new DateTimeRange(timestamp(), timestamp().add(1, 'day'))
      const result = DateTimeRangeDto.from(input)

      expect(result).toBeDefined()
      expect(result.from).toBe(input.from.toISOString())
      expect(result.until).toBe(input.until.toISOString())
    })
  })
})
