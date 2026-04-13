import {
  describe,
  expect,
  it,
} from 'vitest'

import { PhoneFormatUtil } from '@/utils/phoneFormat.util'

describe('phoneFormatUtil', () => {
  describe('maskPhone', () => {
    it('should mask a Belgian mobile number', () => {
      expect(PhoneFormatUtil.maskPhone('+32 470 12 34 56')).toBe('+** *** ** 34 56')
    })

    it('should mask a Belgian landline number', () => {
      expect(PhoneFormatUtil.maskPhone('+32 2 123 45 67')).toBe('+** * *** 45 67')
    })

    it('should mask a Belgian number without country code', () => {
      expect(PhoneFormatUtil.maskPhone('0470 12 34 56')).toBe('**** ** 34 56')
    })

    it('should return the original for short numbers', () => {
      expect(PhoneFormatUtil.maskPhone('123')).toBe('123')
    })
  })
})
