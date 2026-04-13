/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { describe, before, it } from 'node:test'
import { expect } from 'expect'
import { validate } from 'class-validator'
import { initDayjs } from '../../common/init-dayjs.js'
import { IsTimestamp } from './is-timestamp.validator.js'

describe('IsTimestamp', () => {
  before(() => initDayjs())

  describe('basic validation', () => {
    class TestDto {
      @IsTimestamp()
      timestamp: string
    }

    it('should validate a valid ISO8601 timestamp', async () => {
      const dto = new TestDto()

      dto.timestamp = '2025-01-15T10:30:00Z'

      const errors = await validate(dto)

      expect(errors).toHaveLength(0)
    })

    it('should validate infinity', async () => {
      const dto = new TestDto()

      dto.timestamp = 'infinity'

      const errors = await validate(dto)

      expect(errors).toHaveLength(0)
    })

    it('should validate +infinity', async () => {
      const dto = new TestDto()

      dto.timestamp = '+infinity'

      const errors = await validate(dto)

      expect(errors).toHaveLength(0)
    })

    it('should validate -infinity', async () => {
      const dto = new TestDto()

      dto.timestamp = '-infinity'

      const errors = await validate(dto)

      expect(errors).toHaveLength(0)
    })

    it('should fail for invalid timestamp string', async () => {
      const dto = new TestDto()

      dto.timestamp = 'not-a-timestamp'

      const errors = await validate(dto)

      expect(errors).toHaveLength(1)
      expect(errors[0].property).toBe('timestamp')
    })

    it('should fail for non-string values', async () => {
      const dto = new TestDto()

      dto.timestamp = 12345 as unknown as any

      const errors = await validate(dto)

      expect(errors).toHaveLength(1)
    })
  })

  describe('isAfter validation', () => {
    class TestDto {
      @IsTimestamp()
      startTime: string

      @IsTimestamp({ isAfter: dto => (dto as TestDto).startTime })
      endTime: string
    }

    it('should pass when endTime is after startTime', async () => {
      const dto = new TestDto()

      dto.startTime = '2025-01-15T10:00:00Z'
      dto.endTime = '2025-01-15T11:00:00Z'

      const errors = await validate(dto)

      expect(errors).toHaveLength(0)
    })

    it('should fail when endTime is before startTime', async () => {
      const dto = new TestDto()

      dto.startTime = '2025-01-15T11:00:00Z'
      dto.endTime = '2025-01-15T10:00:00Z'

      const errors = await validate(dto)

      expect(errors.length).toBeGreaterThan(0)

      const endTimeError = errors.find(e => e.property === 'endTime')

      expect(endTimeError).toBeDefined()
      expect(endTimeError?.constraints?.isTimestamp).toContain('must be after')
    })

    it('should fail when endTime equals startTime', async () => {
      const dto = new TestDto()

      dto.startTime = '2025-01-15T10:00:00Z'
      dto.endTime = '2025-01-15T10:00:00Z'

      const errors = await validate(dto)

      const endTimeError = errors.find(e => e.property === 'endTime')

      expect(endTimeError).toBeDefined()
    })

    it('should pass when comparison value is null', async () => {
      const dto = new TestDto()

      dto.startTime = null as any
      dto.endTime = '2025-01-15T10:00:00Z'

      const errors = await validate(dto)
      const endTimeError = errors.find(e => e.property === 'endTime')

      expect(endTimeError).toBeUndefined()
    })
  })

  describe('isBefore validation', () => {
    class TestDto {
      @IsTimestamp({ isBefore: dto => (dto as TestDto).deadline })
      submissionTime: string

      @IsTimestamp()
      deadline: string
    }

    it('should pass when submissionTime is before deadline', async () => {
      const dto = new TestDto()

      dto.submissionTime = '2025-01-15T10:00:00Z'
      dto.deadline = '2025-01-15T11:00:00Z'

      const errors = await validate(dto)

      expect(errors).toHaveLength(0)
    })

    it('should fail when submissionTime is after deadline', async () => {
      const dto = new TestDto()

      dto.submissionTime = '2025-01-15T11:00:00Z'
      dto.deadline = '2025-01-15T10:00:00Z'

      const errors = await validate(dto)

      const submissionError = errors.find(e => e.property === 'submissionTime')

      expect(submissionError).toBeDefined()
      expect(submissionError?.constraints?.isTimestamp).toContain('must be before')
    })

    it('should fail when submissionTime equals deadline', async () => {
      const dto = new TestDto()

      dto.submissionTime = '2025-01-15T10:00:00Z'
      dto.deadline = '2025-01-15T10:00:00Z'

      const errors = await validate(dto)

      const submissionError = errors.find(e => e.property === 'submissionTime')

      expect(submissionError).toBeDefined()
    })

    it('should pass when comparison value is null', async () => {
      const dto = new TestDto()

      dto.submissionTime = '2025-01-15T10:00:00Z'
      dto.deadline = null as any

      const errors = await validate(dto)
      const submissionError = errors.find(e => e.property === 'submissionTime')

      expect(submissionError).toBeUndefined()
    })
  })

  describe('isSameOrAfter validation', () => {
    class TestDto {
      @IsTimestamp()
      minTime: string

      @IsTimestamp({ isSameOrAfter: dto => (dto as TestDto).minTime })
      actualTime: string
    }

    it('should pass when actualTime is after minTime', async () => {
      const dto = new TestDto()

      dto.minTime = '2025-01-15T10:00:00Z'
      dto.actualTime = '2025-01-15T11:00:00Z'

      const errors = await validate(dto)

      expect(errors).toHaveLength(0)
    })

    it('should pass when actualTime equals minTime', async () => {
      const dto = new TestDto()

      dto.minTime = '2025-01-15T10:00:00Z'
      dto.actualTime = '2025-01-15T10:00:00Z'

      const errors = await validate(dto)

      expect(errors).toHaveLength(0)
    })

    it('should fail when actualTime is before minTime', async () => {
      const dto = new TestDto()

      dto.minTime = '2025-01-15T11:00:00Z'
      dto.actualTime = '2025-01-15T10:00:00Z'

      const errors = await validate(dto)

      const actualTimeError = errors.find(e => e.property === 'actualTime')

      expect(actualTimeError).toBeDefined()
      expect(actualTimeError?.constraints?.isTimestamp).toContain('must be same or after')
    })

    it('should pass when comparison value is null', async () => {
      const dto = new TestDto()

      dto.minTime = null as any
      dto.actualTime = '2025-01-15T10:00:00Z'

      const errors = await validate(dto)
      const actualTimeError = errors.find(e => e.property === 'actualTime')

      expect(actualTimeError).toBeUndefined()
    })
  })

  describe('isSameOrBefore validation', () => {
    class TestDto {
      @IsTimestamp({ isSameOrBefore: dto => (dto as TestDto).maxTime })
      actualTime: string

      @IsTimestamp()
      maxTime: string
    }

    it('should pass when actualTime is before maxTime', async () => {
      const dto = new TestDto()

      dto.actualTime = '2025-01-15T10:00:00Z'
      dto.maxTime = '2025-01-15T11:00:00Z'

      const errors = await validate(dto)

      expect(errors).toHaveLength(0)
    })

    it('should pass when actualTime equals maxTime', async () => {
      const dto = new TestDto()

      dto.actualTime = '2025-01-15T10:00:00Z'
      dto.maxTime = '2025-01-15T10:00:00Z'

      const errors = await validate(dto)

      expect(errors).toHaveLength(0)
    })

    it('should fail when actualTime is after maxTime', async () => {
      const dto = new TestDto()

      dto.actualTime = '2025-01-15T11:00:00Z'
      dto.maxTime = '2025-01-15T10:00:00Z'

      const errors = await validate(dto)

      const actualTimeError = errors.find(e => e.property === 'actualTime')

      expect(actualTimeError).toBeDefined()
      expect(actualTimeError?.constraints?.isTimestamp).toContain('must be same or before')
    })

    it('should pass when comparison value is null', async () => {
      const dto = new TestDto()

      dto.actualTime = '2025-01-15T10:00:00Z'
      dto.maxTime = null as any

      const errors = await validate(dto)
      const actualTimeError = errors.find(e => e.property === 'actualTime')

      expect(actualTimeError).toBeUndefined()
    })
  })

  describe('combined validations', () => {
    class TestDto {
      @IsTimestamp()
      start: string

      @IsTimestamp({
        isAfter: dto => (dto as TestDto).start,
        isBefore: dto => (dto as TestDto).end
      })
      middle: string

      @IsTimestamp()
      end: string
    }

    it('should pass when middle is between start and end', async () => {
      const dto = new TestDto()

      dto.start = '2025-01-15T10:00:00Z'
      dto.middle = '2025-01-15T11:00:00Z'
      dto.end = '2025-01-15T12:00:00Z'

      const errors = await validate(dto)

      expect(errors).toHaveLength(0)
    })

    it('should fail when middle is before start', async () => {
      const dto = new TestDto()

      dto.start = '2025-01-15T11:00:00Z'
      dto.middle = '2025-01-15T10:00:00Z'
      dto.end = '2025-01-15T12:00:00Z'

      const errors = await validate(dto)

      const middleError = errors.find(e => e.property === 'middle')

      expect(middleError).toBeDefined()
    })

    it('should fail when middle is after end', async () => {
      const dto = new TestDto()

      dto.start = '2025-01-15T10:00:00Z'
      dto.middle = '2025-01-15T13:00:00Z'
      dto.end = '2025-01-15T12:00:00Z'

      const errors = await validate(dto)

      const middleError = errors.find(e => e.property === 'middle')

      expect(middleError).toBeDefined()
    })
  })

  describe('infinity handling', () => {
    class TestDto {
      @IsTimestamp()
      start: string

      @IsTimestamp({ isAfter: dto => (dto as TestDto).start })
      end: string
    }

    it('should handle infinity correctly', async () => {
      const dto = new TestDto()

      dto.start = '2025-01-15T10:00:00Z'
      dto.end = 'infinity'

      const errors = await validate(dto)

      expect(errors).toHaveLength(0)
    })

    it('should handle -infinity correctly', async () => {
      const dto = new TestDto()

      dto.start = '-infinity'
      dto.end = '2025-01-15T10:00:00Z'

      const errors = await validate(dto)

      expect(errors).toHaveLength(0)
    })

    it('should validate -infinity is before infinity', async () => {
      const dto = new TestDto()

      dto.start = '-infinity'
      dto.end = 'infinity'

      const errors = await validate(dto)

      expect(errors).toHaveLength(0)
    })
  })
})
