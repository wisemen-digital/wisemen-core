import { describe, it } from 'node:test'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { expect } from 'expect'
import { IsDateRange } from '../is-date-range.decorator.js'
import { DateRangeDto } from '../date-range.dto.js'
import { FutureInfinityDate } from '../../plain-date/future-infinity-date.js'
import { plainDate } from '../../plain-date/index.js'

describe('is date range decorator tests', () => {
  describe('starts after option', () => {
    class StartsAfterTestDto {
      @IsDateRange({ startsAfter: () => plainDate.today() })
      range: DateRangeDto
    }

    it('detects validation errors when the date does not start after today', async () => {
      const dto = plainToInstance(StartsAfterTestDto, { range: {
        startDate: plainDate.today().toString(),
        endDate: new FutureInfinityDate().toString()
      } })

      const errors = await validate(dto)

      expect(errors.length).toBeGreaterThan(0)
    })

    it('passes a date range which starts after today', async () => {
      const dto = plainToInstance(StartsAfterTestDto, { range: {
        startDate: plainDate.tomorrow().toString(),
        endDate: new FutureInfinityDate().toString()
      } })

      const errors = await validate(dto)

      expect(errors).toHaveLength(0)
    })
  })

  describe('starts after or on option', () => {
    class StartsAfterOrOnTestDto {
      @IsDateRange({ startsAfterOrOn: () => plainDate.today() })
      range: DateRangeDto
    }

    it('detects validation errors when the date starts before today', async () => {
      const dto = plainToInstance(StartsAfterOrOnTestDto, { range: {
        startDate: plainDate.yesterday().toString(),
        endDate: new FutureInfinityDate().toString()
      } })

      const errors = await validate(dto)

      expect(errors.length).toBeGreaterThan(0)
    })

    it('passes a date range which starts on today', async () => {
      const dto = plainToInstance(StartsAfterOrOnTestDto, { range: {
        startDate: plainDate.today().toString(),
        endDate: new FutureInfinityDate().toString()
      } })

      const errors = await validate(dto)

      expect(errors).toHaveLength(0)
    })
  })

  describe('ends before option', () => {
    class EndsBeforeTestDto {
      @IsDateRange({ endsBefore: () => plainDate.futureInfinity() })
      range: DateRangeDto
    }

    it('detects validation errors when the range does not end before infinity', async () => {
      const dto = plainToInstance(EndsBeforeTestDto, { range: {
        startDate: plainDate.today().toString(),
        endDate: plainDate.futureInfinity().toString()
      } })

      const errors = await validate(dto)

      expect(errors.length).toBeGreaterThan(0)
    })

    it('passes a date range which ends before infinity', async () => {
      const dto = plainToInstance(EndsBeforeTestDto, { range: {
        startDate: plainDate.tomorrow().toString(),
        endDate: plainDate.tomorrow().toString()
      } })

      const errors = await validate(dto)

      expect(errors).toHaveLength(0)
    })
  })

  describe('ends before or on option', () => {
    class EndsBeforeOrOnTestDto {
      @IsDateRange({ endsBeforeOrOn: () => plainDate.tomorrow() })
      range: DateRangeDto
    }

    it('detects validation errors when the range does not end before or on tomorrow', async () => {
      const dto = plainToInstance(EndsBeforeOrOnTestDto, { range: {
        startDate: plainDate.today().toString(),
        endDate: plainDate.futureInfinity().toString()
      } })

      const errors = await validate(dto)

      expect(errors.length).toBeGreaterThan(0)
    })

    it('passes a date range which ends on tomorrow', async () => {
      const dto = plainToInstance(EndsBeforeOrOnTestDto, { range: {
        startDate: plainDate.today().toString(),
        endDate: plainDate.tomorrow().toString()
      } })

      const errors = await validate(dto)

      expect(errors).toHaveLength(0)
    })
  })

  describe('starts before option', () => {
    class StartsBeforeTestDto {
      @IsDateRange({ startsBefore: () => plainDate.tomorrow() })
      range: DateRangeDto
    }

    it('detects validation errors when the date does not start before tomorrow', async () => {
      const dto = plainToInstance(StartsBeforeTestDto, { range: {
        startDate: plainDate.tomorrow().toString(),
        endDate: new FutureInfinityDate().toString()
      } })

      const errors = await validate(dto)

      expect(errors.length).toBeGreaterThan(0)
    })

    it('passes a date range which starts before tomorrow', async () => {
      const dto = plainToInstance(StartsBeforeTestDto, { range: {
        startDate: plainDate.today().toString(),
        endDate: new FutureInfinityDate().toString()
      } })

      const errors = await validate(dto)

      expect(errors).toHaveLength(0)
    })
  })

  describe('starts before or on option', () => {
    class StartsBeforeOrOnTestDto {
      @IsDateRange({ startsBeforeOrOn: () => plainDate.tomorrow() })
      range: DateRangeDto
    }

    it('detects validation errors when the date does not start before or on tomorrow', async () => {
      const dto = plainToInstance(StartsBeforeOrOnTestDto, { range: {
        startDate: plainDate.tomorrow().add(1, 'day').toString(),
        endDate: new FutureInfinityDate().toString()
      } })

      const errors = await validate(dto)

      expect(errors.length).toBeGreaterThan(0)
    })

    it('passes a date range which starts on tomorrow', async () => {
      const dto = plainToInstance(StartsBeforeOrOnTestDto, { range: {
        startDate: plainDate.tomorrow().toString(),
        endDate: new FutureInfinityDate().toString()
      } })

      const errors = await validate(dto)

      expect(errors).toHaveLength(0)
    })
  })

  describe('ends after option', () => {
    class EndsAfterTestDto {
      @IsDateRange({ endsAfter: () => plainDate.today() })
      range: DateRangeDto
    }

    it('detects validation errors when the range does not end after today', async () => {
      const dto = plainToInstance(EndsAfterTestDto, { range: {
        startDate: plainDate.today().toString(),
        endDate: plainDate.today().toString()
      } })

      const errors = await validate(dto)

      expect(errors.length).toBeGreaterThan(0)
    })

    it('passes a date range which ends after today', async () => {
      const dto = plainToInstance(EndsAfterTestDto, { range: {
        startDate: plainDate.today().toString(),
        endDate: plainDate.tomorrow().toString()
      } })

      const errors = await validate(dto)

      expect(errors).toHaveLength(0)
    })
  })

  describe('ends after or on option', () => {
    class EndsAfterOrOnTestDto {
      @IsDateRange({ endsAfterOrOn: () => plainDate.today() })
      range: DateRangeDto
    }

    it('detects validation errors when the range ends before today', async () => {
      const dto = plainToInstance(EndsAfterOrOnTestDto, { range: {
        startDate: plainDate.yesterday().toString(),
        endDate: plainDate.yesterday().toString()
      } })

      const errors = await validate(dto)

      expect(errors.length).toBeGreaterThan(0)
    })

    it('passes a date range which ends on today', async () => {
      const dto = plainToInstance(EndsAfterOrOnTestDto, { range: {
        startDate: plainDate.yesterday().toString(),
        endDate: plainDate.today().toString()
      } })

      const errors = await validate(dto)

      expect(errors).toHaveLength(0)
    })
  })

  describe('finiteOnly option', () => {
    class FiniteDto {
      @IsDateRange({ finiteOnly: true })
      range: DateRangeDto
    }

    it('detects validation errors for (-infinity, date]', async () => {
      const dto = plainToInstance(FiniteDto, { range: {
        startDate: plainDate.pastInfinity().toString(),
        endDate: plainDate.today().toString()
      } })

      const errors = await validate(dto)

      expect(errors).not.toHaveLength(0)
    })

    it('detects validation errors for [date, infinity)', async () => {
      const dto = plainToInstance(FiniteDto, { range: {
        startDate: plainDate.today().toString(),
        endDate: plainDate.futureInfinity().toString()
      } })

      const errors = await validate(dto)

      expect(errors).not.toHaveLength(0)
    })

    it('detects validation errors for (-infinity, infinity)', async () => {
      const dto = plainToInstance(FiniteDto, { range: {
        startDate: plainDate.pastInfinity().toString(),
        endDate: plainDate.futureInfinity().toString()
      } })

      const errors = await validate(dto)

      expect(errors).not.toHaveLength(0)
    })

    it('allows finite ranges', async () => {
      const dto = plainToInstance(FiniteDto, { range: {
        startDate: plainDate.yesterday().toString(),
        endDate: plainDate.today().toString()
      } })

      const errors = await validate(dto)

      expect(errors).toHaveLength(0)
    })
  })
})
