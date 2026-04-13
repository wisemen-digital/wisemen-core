import { before, describe, it } from 'node:test'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { expect } from 'expect'
import { IsDateTimeRange } from '../is-date-time-range.decorator.js'
import { initDayjs } from '../../common/init-dayjs.js'
import { FutureInfinity } from '../../timestamp/future-infinity.js'
import { timestamp } from '../../timestamp/index.js'
import { DateTimeRangeDto } from '../date-time-range.dto.js'

describe('is date time range decorator tests', () => {
  before(() => {
    initDayjs()
  })

  describe('starts after option', () => {
    class StartsAfterTestDto {
      @IsDateTimeRange({ startsAfter: () => timestamp() })
      range: DateTimeRangeDto
    }

    it('detects validation errors when the date does not start after today', async () => {
      const dto = plainToInstance(StartsAfterTestDto, { range: {
        from: timestamp().subtract(1, 'hour').toISOString(),
        until: new FutureInfinity().toISOString()
      } })

      const errors = await validate(dto)

      expect(errors.length).toBeGreaterThan(0)
    })

    it('passes a date range which starts after today', async () => {
      const dto = plainToInstance(StartsAfterTestDto, { range: {
        from: timestamp().add(1, 's').toISOString(),
        until: new FutureInfinity().toISOString()
      } })

      const errors = await validate(dto)

      expect(errors).toHaveLength(0)
    })
  })

  describe('starts after or at option', () => {
    class StartsAfterOrAtTestDto {
      @IsDateTimeRange({ startsAfterOrAt: () => timestamp() })
      range: DateTimeRangeDto
    }

    it('detects validation errors when the date starts before today', async () => {
      const dto = plainToInstance(StartsAfterOrAtTestDto, { range: {
        from: timestamp().subtract(1, 'hour').toISOString(),
        until: new FutureInfinity().toISOString()
      } })

      const errors = await validate(dto)

      expect(errors.length).toBeGreaterThan(0)
    })

    it('passes a date range which starts at today', async () => {
      const dto = plainToInstance(StartsAfterOrAtTestDto, { range: {
        from: timestamp().toISOString(),
        until: new FutureInfinity().toISOString()
      } })

      const errors = await validate(dto)

      expect(errors).toHaveLength(0)
    })
  })

  describe('starts before option', () => {
    class StartsBeforeTestDto {
      @IsDateTimeRange({ startsBefore: () => timestamp() })
      range: DateTimeRangeDto
    }

    it('detects validation errors when the date does not start before today', async () => {
      const dto = plainToInstance(StartsBeforeTestDto, { range: {
        from: timestamp().add(1, 'hour').toISOString(),
        until: new FutureInfinity().toISOString()
      } })

      const errors = await validate(dto)

      expect(errors.length).toBeGreaterThan(0)
    })

    it('passes a date range which starts before today', async () => {
      const dto = plainToInstance(StartsBeforeTestDto, { range: {
        from: timestamp().subtract(1, 's').toISOString(),
        until: new FutureInfinity().toISOString()
      } })

      const errors = await validate(dto)

      expect(errors).toHaveLength(0)
    })
  })

  describe('starts before or at option', () => {
    class StartsBeforeOrAtTestDto {
      @IsDateTimeRange({ startsBeforeOrAt: () => timestamp() })
      range: DateTimeRangeDto
    }

    it('detects validation errors when the date starts after today', async () => {
      const dto = plainToInstance(StartsBeforeOrAtTestDto, { range: {
        from: timestamp().add(1, 'hour').toISOString(),
        until: new FutureInfinity().toISOString()
      } })

      const errors = await validate(dto)

      expect(errors.length).toBeGreaterThan(0)
    })

    it('passes a date range which starts at today', async () => {
      const dto = plainToInstance(StartsBeforeOrAtTestDto, { range: {
        from: timestamp().toISOString(),
        until: new FutureInfinity().toISOString()
      } })

      const errors = await validate(dto)

      expect(errors).toHaveLength(0)
    })
  })

  describe('ends before option', () => {
    class EndsBeforeTestDto {
      @IsDateTimeRange({ endsBefore: () => timestamp().add(10, 'days') })
      range: DateTimeRangeDto
    }

    it('detects validation errors when the range does not end before now + 10 days', async () => {
      const dto = plainToInstance(EndsBeforeTestDto, { range: {
        from: timestamp().toISOString(),
        until: new FutureInfinity().toISOString()
      } })

      const errors = await validate(dto)

      expect(errors.length).toBeGreaterThan(0)
    })

    it('passes a date range which ends before before now + 10 days', async () => {
      const dto = plainToInstance(EndsBeforeTestDto, { range: {
        from: timestamp().toISOString(),
        until: timestamp().add(1, 'day').toISOString()
      } })

      const errors = await validate(dto)

      expect(errors).toHaveLength(0)
    })
  })

  describe('ends before or at option', () => {
    class EndsBeforeOrAtTestDto {
      @IsDateTimeRange({ endsBeforeOrAt: () => timestamp().add(10, 'days') })
      range: DateTimeRangeDto
    }

    it('detects validation errors when the range does not end before or at now + 10 days', async () => {
      const dto = plainToInstance(EndsBeforeOrAtTestDto, { range: {
        from: timestamp().toISOString(),
        until: new FutureInfinity().toISOString()
      } })

      const errors = await validate(dto)

      expect(errors.length).toBeGreaterThan(0)
    })

    it('passes a date range which ends at now + 10 days', async () => {
      const dto = plainToInstance(EndsBeforeOrAtTestDto, { range: {
        from: timestamp().toISOString(),
        until: timestamp().add(10, 'days').toISOString()
      } })

      const errors = await validate(dto)

      expect(errors).toHaveLength(0)
    })
  })

  describe('ends after option', () => {
    class EndsAfterTestDto {
      @IsDateTimeRange({ endsAfter: () => timestamp() })
      range: DateTimeRangeDto
    }

    it('detects validation errors when the range does not end after today', async () => {
      const dto = plainToInstance(EndsAfterTestDto, { range: {
        from: timestamp().subtract(1, 'hour').toISOString(),
        until: timestamp().toISOString()
      } })

      const errors = await validate(dto)

      expect(errors.length).toBeGreaterThan(0)
    })

    it('passes a date range which ends after today', async () => {
      const dto = plainToInstance(EndsAfterTestDto, { range: {
        from: timestamp().subtract(1, 'hour').toISOString(),
        until: timestamp().add(1, 's').toISOString()
      } })

      const errors = await validate(dto)

      expect(errors).toHaveLength(0)
    })
  })

  describe('ends after or at option', () => {
    class EndsAfterOrAtTestDto {
      @IsDateTimeRange({ endsAfterOrAt: () => timestamp() })
      range: DateTimeRangeDto
    }

    it('detects validation errors when the range ends before today', async () => {
      const dto = plainToInstance(EndsAfterOrAtTestDto, { range: {
        from: timestamp().subtract(2, 'hour').toISOString(),
        until: timestamp().subtract(1, 'hour').toISOString()
      } })

      const errors = await validate(dto)

      expect(errors.length).toBeGreaterThan(0)
    })

    it('passes a date range which ends at today', async () => {
      const dto = plainToInstance(EndsAfterOrAtTestDto, { range: {
        from: timestamp().subtract(1, 'hour').toISOString(),
        until: timestamp().toISOString()
      } })

      const errors = await validate(dto)

      expect(errors).toHaveLength(0)
    })
  })

  describe('finiteOnly option', () => {
    class FiniteDto {
      @IsDateTimeRange({ finiteOnly: true })
      range: DateTimeRangeDto
    }

    it('detects validation errors for (-infinity, timestamp)', async () => {
      const dto = plainToInstance(FiniteDto, { range: {
        from: timestamp.pastInfinity().toISOString(),
        until: timestamp().toISOString()
      } })

      const errors = await validate(dto)

      expect(errors).not.toHaveLength(0)
    })

    it('detects validation errors for [timestamp, infinity)', async () => {
      const dto = plainToInstance(FiniteDto, { range: {
        from: timestamp().toISOString(),
        until: timestamp.futureInfinity().toISOString()
      } })

      const errors = await validate(dto)

      expect(errors).not.toHaveLength(0)
    })

    it('detects validation errors for (-infinity, infinity)', async () => {
      const dto = plainToInstance(FiniteDto, { range: {
        from: timestamp.pastInfinity().toISOString(),
        until: timestamp.futureInfinity().toISOString()
      } })

      const errors = await validate(dto)

      expect(errors).not.toHaveLength(0)
    })

    it('allows finite ranges', async () => {
      const dto = plainToInstance(FiniteDto, { range: {
        from: timestamp().subtract(1, 'hour').toISOString(),
        until: timestamp().toISOString()
      } })

      const errors = await validate(dto)

      expect(errors).toHaveLength(0)
    })
  })
})
