import {
  describe,
  expect,
  it,
} from 'vitest'

import { useDataFormatConfig } from '@/composables/config.composable'
import { useNumberFormat } from '@/composables/numberFormat.composable'

const numberFormat = useNumberFormat()

describe('numberUtil', () => {
  describe('format', () => {
    it('should format a number with default precision', () => {
      useDataFormatConfig().update({
        locale: 'en-US',
      })

      expect(numberFormat.format(1234.567)).toBe('1,235')
    })

    it('should format a number with specified precision', () => {
      useDataFormatConfig().update({
        locale: 'en-US',
      })

      expect(numberFormat.format(1234.567, 2)).toBe('1,234.57')
    })

    it('should format a number with nl locale', () => {
      useDataFormatConfig().update({
        locale: 'nl-BE',
      })

      expect(numberFormat.format(1234.567, 2)).toBe('1.234,57')
    })
  })
})

describe('useNumberFormat', () => {
  describe('format', () => {
    it('should format with locale-aware separators', () => {
      useDataFormatConfig().update({
        locale: 'en-US',
      })

      const {
        format,
      } = useNumberFormat()

      expect(format(1234.5, 2)).toBe('1,234.50')
    })

    it('should format with nl locale', () => {
      useDataFormatConfig().update({
        locale: 'nl-BE',
      })

      const {
        format,
      } = useNumberFormat()

      expect(format(1234.5, 2)).toBe('1.234,50')
    })
  })

  describe('toPercent', () => {
    it('should format as percentage', () => {
      useDataFormatConfig().update({
        locale: 'en-US',
      })

      const {
        toPercent,
      } = useNumberFormat()

      expect(toPercent(0.125, 1)).toBe('12.5%')
    })

    it('should format 100% without decimals', () => {
      useDataFormatConfig().update({
        locale: 'en-US',
      })

      const {
        toPercent,
      } = useNumberFormat()

      expect(toPercent(1)).toBe('100%')
    })
  })

  describe('toCompact', () => {
    it('should format large numbers in compact notation', () => {
      useDataFormatConfig().update({
        locale: 'en-US',
      })

      expect(numberFormat.toCompact(1_200_000)).toBe('1.2M')
    })

    it('should not compact small numbers', () => {
      useDataFormatConfig().update({
        locale: 'en-US',
      })

      expect(numberFormat.toCompact(500)).toBe('500')
    })
  })

  describe('toFileSize', () => {
    it('should format 0 bytes', () => {
      useDataFormatConfig().update({
        locale: 'en-US',
      })

      expect(numberFormat.toFileSize(0)).toBe('0 B')
    })

    it('should format bytes', () => {
      useDataFormatConfig().update({
        locale: 'en-US',
      })

      expect(numberFormat.toFileSize(500)).toBe('500 B')
    })

    it('should format kilobytes', () => {
      useDataFormatConfig().update({
        locale: 'en-US',
      })

      expect(numberFormat.toFileSize(1536)).toBe('1.5 kB')
    })

    it('should format megabytes', () => {
      useDataFormatConfig().update({
        locale: 'en-US',
      })

      expect(numberFormat.toFileSize(1_048_576)).toBe('1 MB')
    })
  })

  describe('toRange', () => {
    it('should format a number range', () => {
      useDataFormatConfig().update({
        locale: 'en-US',
      })

      expect(numberFormat.toRange(1000, 2000)).toBe('1,000 – 2,000')
    })

    it('should format with precision', () => {
      useDataFormatConfig().update({
        locale: 'en-US',
      })

      expect(numberFormat.toRange(1.5, 3.7, 1)).toBe('1.5 – 3.7')
    })
  })
})
