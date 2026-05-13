import { describe, it } from 'node:test'
import { expect } from 'expect'
import { DateRange } from '../date-range.js'
import { DateRangeResponse } from '../date-range.response.js'
import { plainDate } from '../../plain-date/index.js'

describe('DateRangeResponse unit tests', () => {
  describe('constructor', () => {
    it('Creates a DateRangeResponse from a DateRange', () => {
      const range = new DateRange(
        plainDate('2024-01-01'),
        plainDate('2024-01-31')
      )

      const response = new DateRangeResponse(range)

      expect(response.startDate).toBe('2024-01-01')
      expect(response.endDate).toBe('2024-01-31')
    })

    it('Converts PlainDate objects to ISO date strings', () => {
      const range = new DateRange(
        plainDate('2024-06-15'),
        plainDate('2024-06-20')
      )

      const response = new DateRangeResponse(range)

      expect(response.startDate).toBe('2024-06-15')
      expect(response.endDate).toBe('2024-06-20')
    })
  })

  describe('from static method', () => {
    it('Creates a DateRangeResponse from a non-null DateRange', () => {
      const range = new DateRange(
        plainDate('2024-01-01'),
        plainDate('2024-12-31')
      )

      const response = DateRangeResponse.from(range)

      expect(response).toBeInstanceOf(DateRangeResponse)
      expect(response?.startDate).toBe('2024-01-01')
      expect(response?.endDate).toBe('2024-12-31')
    })

    it('Returns null when given null', () => {
      const response = DateRangeResponse.from(null)

      expect(response).toBeNull()
    })

    it('Handles DateRange with same start and end date', () => {
      const range = new DateRange(
        plainDate('2024-03-15'),
        plainDate('2024-03-15')
      )

      const response = DateRangeResponse.from(range)

      expect(response).toBeInstanceOf(DateRangeResponse)
      expect(response?.startDate).toBe('2024-03-15')
      expect(response?.endDate).toBe('2024-03-15')
    })

    it('Handles DateRange spanning multiple years', () => {
      const range = new DateRange(
        plainDate('2023-12-25'),
        plainDate('2024-01-05')
      )

      const response = DateRangeResponse.from(range)

      expect(response).toBeInstanceOf(DateRangeResponse)
      expect(response?.startDate).toBe('2023-12-25')
      expect(response?.endDate).toBe('2024-01-05')
    })
  })
})
