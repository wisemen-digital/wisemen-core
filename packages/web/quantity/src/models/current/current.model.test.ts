import {
  CurrentDto,
  CurrentUnit,
} from '@wisemen/quantity'
import {
  describe,
  expect,
  it,
} from 'vitest'

import { Current } from './current.model'

describe('current', () => {
  describe('constructor', () => {
    it('creates a current with value and unit', () => {
      const current = new Current(5, CurrentUnit.AMPERE)

      expect(current.value).toBe(5)
      expect(current.unit).toBe(CurrentUnit.AMPERE)
    })
  })

  describe('getValueIn', () => {
    it('returns the value in the same unit', () => {
      const current = new Current(5, CurrentUnit.AMPERE)

      expect(current.getValueIn(CurrentUnit.AMPERE)).toBe(5)
    })

    it('converts ampere to milliampere', () => {
      const current = new Current(1, CurrentUnit.AMPERE)

      expect(current.getValueIn(CurrentUnit.MILLIAMPERE)).toBe(1_000)
    })

    it('converts milliampere to ampere', () => {
      const current = new Current(500, CurrentUnit.MILLIAMPERE)

      expect(current.getValueIn(CurrentUnit.AMPERE)).toBe(0.5)
    })

    it('converts ampere to kiloampere', () => {
      const current = new Current(5_000, CurrentUnit.AMPERE)

      expect(current.getValueIn(CurrentUnit.KILOAMPERE)).toBe(5)
    })
  })

  describe('toDto', () => {
    it('returns a CurrentDto', () => {
      const current = new Current(5, CurrentUnit.AMPERE)
      const dto = current.toDto()

      expect(dto).toBeInstanceOf(CurrentDto)
      expect(dto.value).toBe(5)
      expect(dto.unit).toBe(CurrentUnit.AMPERE)
    })
  })

  describe('toString', () => {
    it('formats ampere', () => {
      const current = new Current(5.67, CurrentUnit.AMPERE)

      expect(current.toString(CurrentUnit.AMPERE)).toBe('5.7 A')
    })

    it('formats milliampere', () => {
      const current = new Current(1, CurrentUnit.AMPERE)

      expect(current.toString(CurrentUnit.MILLIAMPERE)).toBe('1,000 mA')
    })

    it('uses the stored unit when no unit is provided', () => {
      const current = new Current(5, CurrentUnit.AMPERE)

      expect(current.toString()).toBe('5 A')
    })
  })
})
