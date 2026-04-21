import {
  describe,
  expect,
  it,
} from 'vitest'

import { PersonNameFormatUtil } from '@/utils/name-format/nameFormat.util'

describe('personNameFormatUtil', () => {
  describe('toFullPersonName', () => {
    it('should combine first and last name', () => {
      expect(PersonNameFormatUtil.toFullName({
        firstName: 'John',
        lastName: 'Doe',
      })).toBe('John Doe')
    })

    it('should handle null last name', () => {
      expect(PersonNameFormatUtil.toFullName({
        firstName: 'John',
        lastName: null,
      })).toBe('John')
    })

    it('should handle null first name', () => {
      expect(PersonNameFormatUtil.toFullName({
        firstName: null,
        lastName: 'Doe',
      })).toBe('Doe')
    })

    it('should handle both null', () => {
      expect(PersonNameFormatUtil.toFullName({
        firstName: null,
        lastName: null,
      })).toBe('')
    })

    it('should handle blank strings', () => {
      expect(PersonNameFormatUtil.toFullName({
        firstName: 'John',
        lastName: '  ',
      })).toBe('John')
    })
  })

  describe('toInitials', () => {
    it('should return initials for first and last name', () => {
      expect(PersonNameFormatUtil.toInitials({
        firstName: 'John',
        lastName: 'Doe',
      })).toBe('JD')
    })

    it('should handle null last name', () => {
      expect(PersonNameFormatUtil.toInitials({
        firstName: 'Alice',
        lastName: null,
      })).toBe('A')
    })

    it('should handle null first name', () => {
      expect(PersonNameFormatUtil.toInitials({
        firstName: null,
        lastName: 'Doe',
      })).toBe('D')
    })

    it('should handle both null', () => {
      expect(PersonNameFormatUtil.toInitials({
        firstName: null,
        lastName: null,
      })).toBe('')
    })
  })
})
