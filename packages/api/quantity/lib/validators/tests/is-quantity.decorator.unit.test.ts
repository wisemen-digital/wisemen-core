import { describe, it } from 'node:test'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { expect } from 'expect'
import { Distance } from '../../quantities/distance/distance.js'
import { DistanceUnit } from '../../quantities/distance/distance-unit.enum.js'
import { DistanceDto } from '../../quantities/distance/distance.dto.js'
import { IsQuantity } from '../is-quantity.decorator.js'

describe('is quantity decorator tests', () => {
  describe('min option', () => {
    class MinDistanceTestDto {
      @IsQuantity(DistanceDto, { min: new Distance(10, DistanceUnit.METER) })
      distance: DistanceDto
    }

    it('detects validation errors when the distance is less than the minimum', async () => {
      const dto = plainToInstance(MinDistanceTestDto, { distance: {
        value: 5,
        unit: DistanceUnit.METER
      } })

      const errors = await validate(dto)

      expect(errors.length).toBeGreaterThan(0)
    })

    it('passes a distance exactly at the minimum', async () => {
      const dto = plainToInstance(MinDistanceTestDto, { distance: {
        value: 10,
        unit: DistanceUnit.METER
      } })

      const errors = await validate(dto)

      expect(errors).toHaveLength(0)
    })

    it('passes a distance above the minimum', async () => {
      const dto = plainToInstance(MinDistanceTestDto, { distance: {
        value: 20,
        unit: DistanceUnit.METER
      } })

      const errors = await validate(dto)

      expect(errors).toHaveLength(0)
    })

    it('passes a distance above the minimum expressed in a different unit', async () => {
      const dto = plainToInstance(MinDistanceTestDto, { distance: {
        value: 0.02,
        unit: DistanceUnit.KILOMETER
      } })

      const errors = await validate(dto)

      expect(errors).toHaveLength(0)
    })

    it('detects validation errors when the distance is less than the minimum expressed in a different unit', async () => {
      const dto = plainToInstance(MinDistanceTestDto, { distance: {
        value: 0.005,
        unit: DistanceUnit.KILOMETER
      } })

      const errors = await validate(dto)

      expect(errors.length).toBeGreaterThan(0)
    })
  })

  describe('max option', () => {
    class MaxDistanceTestDto {
      @IsQuantity(DistanceDto, { max: new Distance(100, DistanceUnit.METER) })
      distance: DistanceDto
    }

    it('detects validation errors when the distance exceeds the maximum', async () => {
      const dto = plainToInstance(MaxDistanceTestDto, { distance: {
        value: 150,
        unit: DistanceUnit.METER
      } })

      const errors = await validate(dto)

      expect(errors.length).toBeGreaterThan(0)
    })

    it('passes a distance exactly at the maximum', async () => {
      const dto = plainToInstance(MaxDistanceTestDto, { distance: {
        value: 100,
        unit: DistanceUnit.METER
      } })

      const errors = await validate(dto)

      expect(errors).toHaveLength(0)
    })

    it('passes a distance below the maximum', async () => {
      const dto = plainToInstance(MaxDistanceTestDto, { distance: {
        value: 50,
        unit: DistanceUnit.METER
      } })

      const errors = await validate(dto)

      expect(errors).toHaveLength(0)
    })

    it('passes a distance below the maximum expressed in a different unit', async () => {
      const dto = plainToInstance(MaxDistanceTestDto, { distance: {
        value: 0.05,
        unit: DistanceUnit.KILOMETER
      } })

      const errors = await validate(dto)

      expect(errors).toHaveLength(0)
    })

    it('detects validation errors when the distance exceeds the maximum expressed in a different unit', async () => {
      const dto = plainToInstance(MaxDistanceTestDto, { distance: {
        value: 0.2,
        unit: DistanceUnit.KILOMETER
      } })

      const errors = await validate(dto)

      expect(errors.length).toBeGreaterThan(0)
    })
  })

  describe('min and max options together', () => {
    class MinMaxDistanceTestDto {
      @IsQuantity(DistanceDto, {
        min: new Distance(10, DistanceUnit.METER),
        max: new Distance(100, DistanceUnit.METER)
      })
      distance: DistanceDto
    }

    it('detects validation errors when the distance is below the minimum', async () => {
      const dto = plainToInstance(MinMaxDistanceTestDto, { distance: {
        value: 5,
        unit: DistanceUnit.METER
      } })

      const errors = await validate(dto)

      expect(errors.length).toBeGreaterThan(0)
    })

    it('detects validation errors when the distance exceeds the maximum', async () => {
      const dto = plainToInstance(MinMaxDistanceTestDto, { distance: {
        value: 150,
        unit: DistanceUnit.METER
      } })

      const errors = await validate(dto)

      expect(errors.length).toBeGreaterThan(0)
    })

    it('passes a distance within the range', async () => {
      const dto = plainToInstance(MinMaxDistanceTestDto, { distance: {
        value: 50,
        unit: DistanceUnit.METER
      } })

      const errors = await validate(dto)

      expect(errors).toHaveLength(0)
    })

    it('passes a distance at the minimum boundary', async () => {
      const dto = plainToInstance(MinMaxDistanceTestDto, { distance: {
        value: 10,
        unit: DistanceUnit.METER
      } })

      const errors = await validate(dto)

      expect(errors).toHaveLength(0)
    })

    it('passes a distance at the maximum boundary', async () => {
      const dto = plainToInstance(MinMaxDistanceTestDto, { distance: {
        value: 100,
        unit: DistanceUnit.METER
      } })

      const errors = await validate(dto)

      expect(errors).toHaveLength(0)
    })
  })
})
