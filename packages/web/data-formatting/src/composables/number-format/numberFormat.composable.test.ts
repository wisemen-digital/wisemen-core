import {
  describe,
  expect,
  it,
} from 'vitest'

import { useDataFormatConfig } from '@/composables/config.composable'
import { useNumberFormat } from '@/composables/number-format/numberFormat.composable'

describe('useNumberFormat', () => {
  const dataConfig = useDataFormatConfig()
  const numberFormat = useNumberFormat()

  describe('format', () => {
    it('should format a number with default precision', () => {
      dataConfig.update({
        locale: 'en-US',
      })

      expect(numberFormat.format(1234.567)).toBe('1,235')
    })

    it('should format a number with specified precision', () => {
      dataConfig.update({
        locale: 'en-US',
      })

      expect(numberFormat.format(1234.567, 2)).toBe('1,234.57')
    })

    it('should format a number with nl locale', () => {
      dataConfig.update({
        locale: 'nl-BE',
      })

      expect(numberFormat.format(1234.567, 2)).toBe('1.234,57')
    })
  })

  describe('toPercent', () => {
    it('should format as percentage', () => {
      dataConfig.update({
        locale: 'en-US',
      })

      expect(numberFormat.toPercent(0.125, 1)).toBe('12.5%')
    })

    it('should format 100% without decimals', () => {
      dataConfig.update({
        locale: 'en-US',
      })

      expect(numberFormat.toPercent(1)).toBe('100%')
    })
  })

  describe('toCompact', () => {
    it('should format large numbers in compact notation', () => {
      dataConfig.update({
        locale: 'en-US',
      })

      expect(numberFormat.toCompact(1_200_000)).toBe('1.2M')
    })

    it('should not compact small numbers', () => {
      dataConfig.update({
        locale: 'en-US',
      })

      expect(numberFormat.toCompact(500)).toBe('500')
    })
  })

  describe('toFileSize', () => {
    it('should format 0 bytes', () => {
      dataConfig.update({
        locale: 'en-US',
      })

      expect(numberFormat.toFileSize(0)).toBe('0 B')
    })

    it('should format bytes', () => {
      dataConfig.update({
        locale: 'en-US',
      })

      expect(numberFormat.toFileSize(500)).toBe('500 B')
    })

    it('should format kilobytes', () => {
      dataConfig.update({
        locale: 'en-US',
      })

      expect(numberFormat.toFileSize(1536)).toBe('1.5 kB')
    })

    it('should format megabytes', () => {
      dataConfig.update({
        locale: 'en-US',
      })

      expect(numberFormat.toFileSize(1_048_576)).toBe('1 MB')
    })
  })

  describe('toRange', () => {
    it('should format a number range', () => {
      dataConfig.update({
        locale: 'en-US',
      })

      expect(numberFormat.toRange(1000, 2000)).toBe('1,000 – 2,000')
    })

    it('should format with precision', () => {
      dataConfig.update({
        locale: 'en-US',
      })

      expect(numberFormat.toRange(1.5, 3.7, 1)).toBe('1.5 – 3.7')
    })
  })
})
