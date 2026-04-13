import {
  describe,
  expect,
  it,
} from 'vitest'

import { EmailFormatUtil } from '@/utils/emailFormat.util'

describe('emailFormatUtil', () => {
  describe('mask', () => {
    it('should mask the local part except the first character', () => {
      expect(EmailFormatUtil.mask('john@example.com')).toBe('j***@example.com')
    })

    it('should return the original string when no @ is present', () => {
      expect(EmailFormatUtil.mask('invalid')).toBe('invalid')
    })

    it('should handle a single character local part', () => {
      expect(EmailFormatUtil.mask('j@example.com')).toBe('j@example.com')
    })

    it('should mask a longer local part', () => {
      expect(EmailFormatUtil.mask('alexander@example.com')).toBe('a********@example.com')
    })
  })
})
