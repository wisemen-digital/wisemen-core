import { describe, it } from 'node:test'
import { expect } from 'expect'
import { DateRangeDto } from '../date-range.dto.js'
import { DateRange } from '../date-range.js'
import { today, tomorrow } from '../../plain-date/index.js'

describe('DateRangeDto - Unit Tests', () => {
  describe('from', () => {
    it('returns null if input is null', () => {
      const input = null
      const result = DateRangeDto.from(input)

      expect(result).toBeNull()
    })

    it('returns undefined if input is undefined', () => {
      const input = undefined
      const result = DateRangeDto.from(input)

      expect(result).toBeUndefined()
    })

    it('returns the dto with correct fields if input is a DateRange', () => {
      const input = new DateRange(today(), tomorrow())
      const result = DateRangeDto.from(input)

      expect(result).toBeDefined()
      expect(result.startDate).toBe(input.startDate.toString())
      expect(result.endDate).toBe(input.endDate.toString())
    })
  })
})
