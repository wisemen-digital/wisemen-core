import { describe, it } from 'node:test'
import { FutureInfinityDate, WiseDate } from '@wisemen/wise-date'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { expect } from 'expect'
import { IsDateRange } from '#src/is-date-range.decorator.js'
import { DateRangeDto } from '#src/date-range.dto.js'

describe('is date range decorator tests', () => {
  describe('starts after option', () => {
    class StartsAfterTestDto {
      @IsDateRange({ startsAfter: WiseDate.today })
      range: DateRangeDto
    }

    it('detects validation errors when the date does not start after today', async () => {
      const dto = plainToInstance(StartsAfterTestDto, { range: {
        startDate: WiseDate.today().toString(),
        endDate: new FutureInfinityDate().toString()
      } })

      const errors = await validate(dto)

      expect(errors.length).toBeGreaterThan(0)
    })

    it('passes a date range which starts after today', async () => {
      const dto = plainToInstance(StartsAfterTestDto, { range: {
        startDate: WiseDate.tomorrow().toString(),
        endDate: new FutureInfinityDate().toString()
      } })

      const errors = await validate(dto)

      expect(errors).toHaveLength(0)
    })
  })

  describe('ends before option', () => {
    class EndsBeforeTestDto {
      @IsDateRange({ endsBefore: () => new FutureInfinityDate() })
      range: DateRangeDto
    }

    it('detects validation errors when the range does not end before infinity', async () => {
      const dto = plainToInstance(EndsBeforeTestDto, { range: {
        startDate: WiseDate.today().toString(),
        endDate: new FutureInfinityDate().toString()
      } })

      const errors = await validate(dto)

      expect(errors.length).toBeGreaterThan(0)
    })

    it('passes a date range which ends before infinity', async () => {
      const dto = plainToInstance(EndsBeforeTestDto, { range: {
        startDate: WiseDate.tomorrow().toString(),
        endDate: WiseDate.tomorrow().toString()
      } })

      const errors = await validate(dto)

      expect(errors).toHaveLength(0)
    })
  })

  describe('starts before option', () => {
    class StartsBeforeTestDto {
      @IsDateRange({ startsBefore: WiseDate.tomorrow })
      range: DateRangeDto
    }

    it('detects validation errors when the date does not start before tomorrow', async () => {
      const dto = plainToInstance(StartsBeforeTestDto, { range: {
        startDate: WiseDate.tomorrow().toString(),
        endDate: new FutureInfinityDate().toString()
      } })

      const errors = await validate(dto)

      expect(errors.length).toBeGreaterThan(0)
    })

    it('passes a date range which starts before tomorrow', async () => {
      const dto = plainToInstance(StartsBeforeTestDto, { range: {
        startDate: WiseDate.today().toString(),
        endDate: new FutureInfinityDate().toString()
      } })

      const errors = await validate(dto)

      expect(errors).toHaveLength(0)
    })
  })

  describe('ends after option', () => {
    class EndsAfterTestDto {
      @IsDateRange({ endsAfter: WiseDate.today })
      range: DateRangeDto
    }

    it('detects validation errors when the range does not end after today', async () => {
      const dto = plainToInstance(EndsAfterTestDto, { range: {
        startDate: WiseDate.today().toString(),
        endDate: WiseDate.today().toString()
      } })

      const errors = await validate(dto)

      expect(errors.length).toBeGreaterThan(0)
    })

    it('passes a date range which ends after today', async () => {
      const dto = plainToInstance(EndsAfterTestDto, { range: {
        startDate: WiseDate.today().toString(),
        endDate: WiseDate.tomorrow().toString()
      } })

      const errors = await validate(dto)

      expect(errors).toHaveLength(0)
    })
  })
})
