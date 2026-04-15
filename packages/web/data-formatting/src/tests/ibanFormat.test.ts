import {
  describe,
  expect,
  it,
} from 'vitest'

import { IbanFormatUtil } from '@/utils/ibanFormat.util'

describe('ibanFormatUtil', () => {
  describe('maskIban', () => {
    it('should mask a BE IBAN', () => {
      expect(IbanFormatUtil.mask('BE68 5390 0754 7034')).toBe('BE** **** **** 7034')
    })

    it('should mask an IBAN without spaces', () => {
      expect(IbanFormatUtil.mask('BE68539007547034')).toBe('BE** **** **** 7034')
    })

    it('should return the original for short IBANs', () => {
      expect(IbanFormatUtil.mask('BE68539')).toBe('BE68539')
    })
  })
})
