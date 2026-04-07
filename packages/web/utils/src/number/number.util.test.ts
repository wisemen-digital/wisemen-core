import {
  describe,
  expect,
  it,
} from 'vitest'

import { NumberUtil } from './number.util'

describe('numberUtil', () => {
  describe('clamp', () => {
    it('clamps a value above the maximum', () => {
      expect(NumberUtil.clamp(15, 0, 10)).toBe(10)
    })

    it('clamps a value below the minimum', () => {
      expect(NumberUtil.clamp(-5, 0, 10)).toBe(0)
    })

    it('returns the value when within bounds', () => {
      expect(NumberUtil.clamp(5, 0, 10)).toBe(5)
    })
  })

  describe('round', () => {
    it('rounds to the given decimal places', () => {
      expect(NumberUtil.round(3.141_59, 2)).toBe(3.14)
    })

    it('rounds to zero decimal places by default', () => {
      expect(NumberUtil.round(3.7)).toBe(4)
    })

    it('handles rounding up', () => {
      expect(NumberUtil.round(2.675, 2)).toBe(2.68)
    })
  })

  describe('percentage', () => {
    it('calculates the percentage correctly', () => {
      expect(NumberUtil.percentage(25, 200)).toBe(12.5)
    })

    it('returns 0 when total is 0', () => {
      expect(NumberUtil.percentage(1, 0)).toBe(0)
    })
  })

  describe('sum', () => {
    it('sums an array of numbers', () => {
      expect(NumberUtil.sum([
        1,
        2,
        3,
        4,
      ])).toBe(10)
    })

    it('returns 0 for an empty array', () => {
      expect(NumberUtil.sum([])).toBe(0)
    })
  })

  describe('average', () => {
    it('calculates the average of an array', () => {
      expect(NumberUtil.average([
        1,
        2,
        3,
        4,
      ])).toBe(2.5)
    })

    it('returns 0 for an empty array', () => {
      expect(NumberUtil.average([])).toBe(0)
    })
  })
})
