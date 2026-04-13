import { describe, it } from 'node:test'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { expect } from 'expect'
import { IsDateTimeRange } from '#src/is-date-time-range.decorator.js'
import { DateTimeRangeDto } from '#src/date-time-range.command.js'
import { timestamp } from '#src/timestamp.factory.js'
import { FutureInfinity } from '#src/future-infinity.js'

describe('is date time range decorator tests', () => {
  describe('starts after option', () => {
    class StartsAfterTestDto {
      @IsDateTimeRange({ startsAfter: () => timestamp() })
      range: DateTimeRangeDto
    }

    it('detects validation errors when the date does not start after today', async () => {
      const dto = plainToInstance(StartsAfterTestDto, { range: {
        startDate: timestamp().subtract(1, 'hour').toISOString(),
        endDate: new FutureInfinity().toISOString()
      } })

      const errors = await validate(dto)

      expect(errors.length).toBeGreaterThan(0)
    })

    it('passes a date range which starts after today', async () => {
      const dto = plainToInstance(StartsAfterTestDto, { range: {
        startDate: timestamp().add(1, 's').toISOString(),
        endDate: new FutureInfinity().toISOString()
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
        startDate: timestamp().toISOString(),
        endDate: new FutureInfinity().toISOString()
      } })

      const errors = await validate(dto)

      expect(errors.length).toBeGreaterThan(0)
    })

    it('passes a date range which ends before before now + 10 days', async () => {
      const dto = plainToInstance(EndsBeforeTestDto, { range: {
        startDate: timestamp().toISOString(),
        endDate: timestamp().add(1, 'day').toISOString()
      } })

      const errors = await validate(dto)

      expect(errors).toHaveLength(0)
    })
  })
})
