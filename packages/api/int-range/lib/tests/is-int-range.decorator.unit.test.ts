import { describe, it } from 'node:test'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { expect } from 'expect'
import { IsIntRange } from '#src/is-int-range.decorator.js'
import { IntRangeDto } from '#src/int-range.command.js'

describe('is int range decorator tests', () => {
  describe('starts after option', () => {
    class StartsAfterTestDto {
      @IsIntRange({ startsAfter: () => 100 })
      range: IntRangeDto
    }

    it('detects validation errors when the range does not start after 100', async () => {
      const dto = plainToInstance(StartsAfterTestDto, { range: {
        start: '50',
        end: '200'
      } })

      const errors = await validate(dto)

      expect(errors.length).toBeGreaterThan(0)
    })

    it('passes a range which starts after 100', async () => {
      const dto = plainToInstance(StartsAfterTestDto, { range: {
        start: '101',
        end: '200'
      } })

      const errors = await validate(dto)

      expect(errors).toHaveLength(0)
    })
  })

  describe('ends before option', () => {
    class EndsBeforeTestDto {
      @IsIntRange({ endsBefore: () => 500 })
      range: IntRangeDto
    }

    it('detects validation errors when the range does not end before 500', async () => {
      const dto = plainToInstance(EndsBeforeTestDto, { range: {
        start: '100',
        end: '600'
      } })

      const errors = await validate(dto)

      expect(errors.length).toBeGreaterThan(0)
    })

    it('passes a range which ends before 500', async () => {
      const dto = plainToInstance(EndsBeforeTestDto, { range: {
        start: '100',
        end: '400'
      } })

      const errors = await validate(dto)

      expect(errors).toHaveLength(0)
    })
  })
})
