import {
  describe,
  expect,
  it,
} from 'vitest'

import { StringUtil } from './string.util'

describe('stringUtil', () => {
  describe('camelToKebab', () => {
    it('converts camelCase to kebab-case', () => {
      expect(StringUtil.camelToKebab('myVariableName')).toBe('my-variable-name')
    })

    it('converts PascalCase to kebab-case', () => {
      expect(StringUtil.camelToKebab('MyComponent')).toBe('my-component')
    })
  })

  describe('capitalize', () => {
    it('capitalizes the first character and lowercases the rest', () => {
      expect(StringUtil.capitalize('hELLO')).toBe('Hello')
    })

    it('handles already-capitalized strings', () => {
      expect(StringUtil.capitalize('WORLD')).toBe('World')
    })

    it('handles lowercase strings', () => {
      expect(StringUtil.capitalize('foo')).toBe('Foo')
    })

    it('returns an empty string unchanged', () => {
      expect(StringUtil.capitalize('')).toBe('')
    })
  })

  describe('isEmpty', () => {
    it('returns true for an empty string', () => {
      expect(StringUtil.isEmpty('')).toBeTruthy()
    })

    it('returns true for a whitespace-only string', () => {
      expect(StringUtil.isEmpty('   ')).toBeTruthy()
    })

    it('returns true for null', () => {
      expect(StringUtil.isEmpty(null)).toBeTruthy()
    })

    it('returns true for undefined', () => {
      expect(StringUtil.isEmpty()).toBeTruthy()
    })

    it('returns false for a non-empty string', () => {
      expect(StringUtil.isEmpty('hello')).toBeFalsy()
    })
  })

  describe('truncate', () => {
    it('truncates a string that exceeds maxLength', () => {
      expect(StringUtil.truncate('Hello, world!', 5)).toBe('Hello...')
    })

    it('returns the string unchanged when within maxLength', () => {
      expect(StringUtil.truncate('Hi', 10)).toBe('Hi')
    })

    it('returns the string unchanged when exactly at maxLength', () => {
      expect(StringUtil.truncate('Hello', 5)).toBe('Hello')
    })
  })

  describe('slugify', () => {
    it('converts a string to a slug', () => {
      expect(StringUtil.slugify('Hello World!')).toBe('hello-world')
    })

    it('strips leading and trailing spaces', () => {
      expect(StringUtil.slugify('  Foo & Bar  ')).toBe('foo-bar')
    })

    it('converts accented characters', () => {
      expect(StringUtil.slugify('café')).toBe('cafe')
    })

    it('collapses multiple spaces into a single hyphen', () => {
      expect(StringUtil.slugify('foo   bar')).toBe('foo-bar')
    })
  })

  describe('stripHtml', () => {
    it('removes HTML tags from a string', () => {
      expect(StringUtil.stripHtml('<p>Hello <b>world</b></p>')).toBe('Hello world')
    })

    it('returns a plain string unchanged', () => {
      expect(StringUtil.stripHtml('no tags here')).toBe('no tags here')
    })
  })
})
