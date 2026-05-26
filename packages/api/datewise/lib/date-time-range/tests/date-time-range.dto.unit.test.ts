import { before, describe, it } from 'node:test'
import { expect } from 'expect'
import { DateTimeRangeDto } from '../date-time-range.dto.js'
import { DateTimeRange } from '../date-time-range.js'
import { initDayjs } from '../../common/init-dayjs.js'

describe('DateTimeRangeDto unit tests', () => {
  before(() => {
    initDayjs()
  })

  describe('parse method', () => {
    it('Parses a dto into a DateTimeRange with default inclusivity [)', () => {
      const dto = new DateTimeRangeDto()
      dto.from = '2024-01-01T00:00:00.000Z'
      dto.until = '2024-01-31T23:59:59.999Z'

      const range = dto.parse()

      expect(range).toBeInstanceOf(DateTimeRange)
      expect(range.inclLower.toISOString()).toBe('2024-01-01T00:00:00.000Z')
      expect(range.exclUpper.toISOString()).toBe('2024-01-31T23:59:59.999Z')
    })

    it('Parses a dto into a DateTimeRange with custom inclusivity []', () => {
      const dto = new DateTimeRangeDto()
      dto.from = '2024-01-01T00:00:00.000Z'
      dto.until = '2024-01-31T23:59:59.999Z'

      const range = dto.parse('[]')

      expect(range).toBeInstanceOf(DateTimeRange)
      expect(range.inclLower.toISOString()).toBe('2024-01-01T00:00:00.000Z')
      // With [] inclusivity, the upper bound is inclusive, so exclUpper is 1ms after
      expect(range.exclUpper.toISOString()).toBe('2024-02-01T00:00:00.000Z')
    })

    it('Parses a dto into a DateTimeRange with custom inclusivity (]', () => {
      const dto = new DateTimeRangeDto()
      dto.from = '2024-01-01T00:00:00.000Z'
      dto.until = '2024-01-31T23:59:59.999Z'

      const range = dto.parse('(]')

      expect(range).toBeInstanceOf(DateTimeRange)
      // With (] inclusivity, the lower bound is exclusive, so inclLower is 1ms after
      expect(range.inclLower.toISOString()).toBe('2024-01-01T00:00:00.001Z')
      // Upper bound is inclusive, so exclUpper is 1ms after
      expect(range.exclUpper.toISOString()).toBe('2024-02-01T00:00:00.000Z')
    })

    it('Parses a dto into a DateTimeRange with custom inclusivity ()', () => {
      const dto = new DateTimeRangeDto()
      dto.from = '2024-01-01T00:00:00.000Z'
      dto.until = '2024-01-31T23:59:59.999Z'

      const range = dto.parse('()')

      expect(range).toBeInstanceOf(DateTimeRange)
      // With () inclusivity, both bounds are exclusive
      expect(range.inclLower.toISOString()).toBe('2024-01-01T00:00:00.001Z')
      expect(range.exclUpper.toISOString()).toBe('2024-01-31T23:59:59.999Z')
    })

    it('Handles millisecond precision', () => {
      const dto = new DateTimeRangeDto()
      dto.from = '2024-03-15T10:20:30.123Z'
      dto.until = '2024-03-15T10:20:30.456Z'

      const range = dto.parse()

      expect(range).toBeInstanceOf(DateTimeRange)
      expect(range.inclLower.toISOString()).toBe('2024-03-15T10:20:30.123Z')
      expect(range.exclUpper.toISOString()).toBe('2024-03-15T10:20:30.456Z')
    })

    it('Handles a dto spanning year boundary', () => {
      const dto = new DateTimeRangeDto()
      dto.from = '2023-12-31T22:00:00.000Z'
      dto.until = '2024-01-01T02:00:00.000Z'

      const range = dto.parse()

      expect(range).toBeInstanceOf(DateTimeRange)
      expect(range.inclLower.toISOString()).toBe('2023-12-31T22:00:00.000Z')
      expect(range.exclUpper.toISOString()).toBe('2024-01-01T02:00:00.000Z')
    })

    it('Explicitly passing [) inclusivity behaves the same as default', () => {
      const dto = new DateTimeRangeDto()
      dto.from = '2024-06-01T10:00:00.000Z'
      dto.until = '2024-06-30T18:00:00.000Z'

      const rangeDefault = dto.parse()
      const rangeExplicit = dto.parse('[)')

      expect(rangeDefault.inclLower.toISOString()).toBe(rangeExplicit.inclLower.toISOString())
      expect(rangeDefault.exclUpper.toISOString()).toBe(rangeExplicit.exclUpper.toISOString())
    })

    it('Handles short duration ranges', () => {
      const dto = new DateTimeRangeDto()
      dto.from = '2024-05-15T14:30:00.000Z'
      dto.until = '2024-05-15T14:30:01.000Z'

      const range = dto.parse()

      expect(range).toBeInstanceOf(DateTimeRange)
      expect(range.inclLower.toISOString()).toBe('2024-05-15T14:30:00.000Z')
      expect(range.exclUpper.toISOString()).toBe('2024-05-15T14:30:01.000Z')
    })
  })
})
