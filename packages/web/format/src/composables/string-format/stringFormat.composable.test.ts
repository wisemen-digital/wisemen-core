import {
  describe,
  expect,
  it,
} from 'vitest'

import { useDataFormatConfig } from '@/composables/config.composable'
import { useStringFormat } from '@/composables/string-format/stringFormat.composable'

describe('useStringFormat', () => {
  const dataConfig = useDataFormatConfig()
  const stringFormat = useStringFormat()

  describe('toList', () => {
    it('should format items as a conjunction list', () => {
      dataConfig.update({
        locale: 'en',
      })

      expect(stringFormat.toList([
        'a',
        'b',
        'c',
      ])).toBe('a, b, and c')
    })

    it('should format items as a disjunction list', () => {
      dataConfig.update({
        locale: 'en',
      })

      expect(stringFormat.toList([
        'a',
        'b',
        'c',
      ], 'disjunction')).toBe('a, b, or c')
    })
  })
})
