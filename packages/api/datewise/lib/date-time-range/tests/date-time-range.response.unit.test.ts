import { before, describe, it } from 'node:test'
import { expect } from 'expect'
import { DateTimeRange } from '../date-time-range.js'
import { DateTimeRangeResponse } from '../date-time-range.response.js'
import { timestamp } from '../../timestamp/index.js'
import { initDayjs } from '../../common/init-dayjs.js'

describe('DateTimeRangeResponse unit tests', () => {
  before(() => {
    initDayjs()
  })

  describe('constructor', () => {
    it('Creates a DateTimeRangeResponse from a DateTimeRange', () => {
      const range = new DateTimeRange(
        timestamp('2024-01-01T00:00:00.000Z'),
        timestamp('2024-01-31T23:59:59.999Z')
      )

      const response = new DateTimeRangeResponse(range)

      expect(response.from).toBe('2024-01-01T00:00:00.000Z')
      expect(response.until).toBe('2024-01-31T23:59:59.999Z')
    })

    it('Converts Timestamp objects to ISO strings', () => {
      const range = new DateTimeRange(
        timestamp('2024-06-15T12:30:00.000Z'),
        timestamp('2024-06-20T18:45:00.000Z')
      )

      const response = new DateTimeRangeResponse(range)

      expect(response.from).toBe('2024-06-15T12:30:00.000Z')
      expect(response.until).toBe('2024-06-20T18:45:00.000Z')
    })

    it('Handles millisecond precision', () => {
      const range = new DateTimeRange(
        timestamp('2024-03-15T10:20:30.123Z'),
        timestamp('2024-03-15T10:20:30.456Z')
      )

      const response = new DateTimeRangeResponse(range)

      expect(response.from).toBe('2024-03-15T10:20:30.123Z')
      expect(response.until).toBe('2024-03-15T10:20:30.456Z')
    })
  })

  describe('from static method', () => {
    it('Creates a DateTimeRangeResponse from a non-null DateTimeRange', () => {
      const range = new DateTimeRange(
        timestamp('2024-01-01T00:00:00.000Z'),
        timestamp('2024-12-31T23:59:59.999Z')
      )

      const response = DateTimeRangeResponse.from(range)

      expect(response).toBeInstanceOf(DateTimeRangeResponse)
      expect(response?.from).toBe('2024-01-01T00:00:00.000Z')
      expect(response?.until).toBe('2024-12-31T23:59:59.999Z')
    })

    it('Returns null when given null', () => {
      const response = DateTimeRangeResponse.from(null)

      expect(response).toBeNull()
    })

    it('Handles DateTimeRange spanning different timezones', () => {
      const range = new DateTimeRange(
        timestamp('2024-03-10T08:00:00.000Z'),
        timestamp('2024-03-11T20:00:00.000Z')
      )

      const response = DateTimeRangeResponse.from(range)

      expect(response).toBeInstanceOf(DateTimeRangeResponse)
      expect(response?.from).toBe('2024-03-10T08:00:00.000Z')
      expect(response?.until).toBe('2024-03-11T20:00:00.000Z')
    })

    it('Handles DateTimeRange spanning year boundary', () => {
      const range = new DateTimeRange(
        timestamp('2023-12-31T22:00:00.000Z'),
        timestamp('2024-01-01T02:00:00.000Z')
      )

      const response = DateTimeRangeResponse.from(range)

      expect(response).toBeInstanceOf(DateTimeRangeResponse)
      expect(response?.from).toBe('2023-12-31T22:00:00.000Z')
      expect(response?.until).toBe('2024-01-01T02:00:00.000Z')
    })

    it('Handles short duration ranges', () => {
      const range = new DateTimeRange(
        timestamp('2024-05-15T14:30:00.000Z'),
        timestamp('2024-05-15T14:30:01.000Z')
      )

      const response = DateTimeRangeResponse.from(range)

      expect(response).toBeInstanceOf(DateTimeRangeResponse)
      expect(response?.from).toBe('2024-05-15T14:30:00.000Z')
      expect(response?.until).toBe('2024-05-15T14:30:01.000Z')
    })
  })
})
