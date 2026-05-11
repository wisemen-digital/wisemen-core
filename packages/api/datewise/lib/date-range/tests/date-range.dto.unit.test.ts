import { describe, it } from 'node:test'
import { expect } from 'expect'
import { DateRangeDto } from '../date-range.dto.js'
import { DateRange } from '../date-range.js'
import { plainDate } from '../../plain-date/index.js'

describe('DateRangeDto unit tests', () => {
  describe('parse method', () => {
    it('Parses a dto into a DateRange with default inclusivity []', () => {
      const dto = new DateRangeDto()
      dto.startDate = '2024-01-01'
      dto.endDate = '2024-01-31'

      const range = dto.parse()

      expect(range).toBeInstanceOf(DateRange)
      expect(range.startDate.toString()).toBe('2024-01-01')
      expect(range.endDate.toString()).toBe('2024-01-31')
    })

    it('Parses a dto into a DateRange with custom inclusivity [)', () => {
      const dto = new DateRangeDto()
      dto.startDate = '2024-01-01'
      dto.endDate = '2024-01-31'

      const range = dto.parse('[)')

      expect(range).toBeInstanceOf(DateRange)
      expect(range.startDate.toString()).toBe('2024-01-01')
      // With [) inclusivity, the end date should be adjusted
      expect(range.endDate.toString()).toBe('2024-01-30')
    })

    it('Parses a dto into a DateRange with custom inclusivity (]', () => {
      const dto = new DateRangeDto()
      dto.startDate = '2024-01-01'
      dto.endDate = '2024-01-31'

      const range = dto.parse('(]')

      expect(range).toBeInstanceOf(DateRange)
      // With (] inclusivity, the start date should be adjusted
      expect(range.startDate.toString()).toBe('2024-01-02')
      expect(range.endDate.toString()).toBe('2024-01-31')
    })

    it('Parses a dto into a DateRange with custom inclusivity ()', () => {
      const dto = new DateRangeDto()
      dto.startDate = '2024-01-01'
      dto.endDate = '2024-01-31'

      const range = dto.parse('()')

      expect(range).toBeInstanceOf(DateRange)
      // With () inclusivity, both dates should be adjusted
      expect(range.startDate.toString()).toBe('2024-01-02')
      expect(range.endDate.toString()).toBe('2024-01-30')
    })

    it('Handles a dto with same start and end date', () => {
      const dto = new DateRangeDto()
      dto.startDate = '2024-03-15'
      dto.endDate = '2024-03-15'

      const range = dto.parse()

      expect(range).toBeInstanceOf(DateRange)
      expect(range.startDate.toString()).toBe('2024-03-15')
      expect(range.endDate.toString()).toBe('2024-03-15')
    })

    it('Handles a dto spanning multiple years', () => {
      const dto = new DateRangeDto()
      dto.startDate = '2023-12-25'
      dto.endDate = '2024-01-05'

      const range = dto.parse()

      expect(range).toBeInstanceOf(DateRange)
      expect(range.startDate.toString()).toBe('2023-12-25')
      expect(range.endDate.toString()).toBe('2024-01-05')
    })

    it('Explicitly passing [] inclusivity behaves the same as default', () => {
      const dto = new DateRangeDto()
      dto.startDate = '2024-06-01'
      dto.endDate = '2024-06-30'

      const rangeDefault = dto.parse()
      const rangeExplicit = dto.parse('[]')

      expect(rangeDefault.startDate.toString()).toBe(rangeExplicit.startDate.toString())
      expect(rangeDefault.endDate.toString()).toBe(rangeExplicit.endDate.toString())
    })
  })
})
