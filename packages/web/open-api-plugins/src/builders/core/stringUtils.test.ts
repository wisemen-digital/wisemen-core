import {
  describe,
  expect,
  it,
} from 'vitest'

import {
  isValidIdentifier,
  normalizeTypeName,
  safePropName,
  safeTypeName,
  toPascal,
} from './stringUtils'

describe('string Utils', () => {
  describe('toPascal', () => {
    it('converts snake_case to PascalCase', () => {
      expect(toPascal('hello_world')).toBe('HelloWorld')
    })

    it('converts kebab-case to PascalCase', () => {
      expect(toPascal('hello-world')).toBe('HelloWorld')
    })

    it('converts space separated to PascalCase', () => {
      expect(toPascal('hello world')).toBe('HelloWorld')
    })

    it('handles already PascalCase strings', () => {
      expect(toPascal('HelloWorld')).toBe('HelloWorld')
    })

    it('handles camelCase strings', () => {
      expect(toPascal('helloWorld')).toBe('HelloWorld')
    })

    it('handles single words', () => {
      expect(toPascal('hello')).toBe('Hello')
    })

    it('handles numbers in strings', () => {
      expect(toPascal('hello_world_123')).toBe('HelloWorld123')
    })
  })

  describe('safeTypeName', () => {
    it('removes invalid characters', () => {
      expect(safeTypeName('Hello-World!')).toBe('Hello_World_')
    })

    it('keeps valid characters', () => {
      expect(safeTypeName('HelloWorld123')).toBe('HelloWorld123')
    })

    it('handles underscores', () => {
      expect(safeTypeName('Hello_World')).toBe('Hello_World')
    })

    it('replaces special characters with underscores', () => {
      expect(safeTypeName('Hello@World#123')).toBe('Hello_World_123')
    })
  })

  describe('normalizeTypeName', () => {
    it('normalizes UI prefix', () => {
      expect(normalizeTypeName('UITheme')).toBe('UiTheme')
    })

    it('normalizes API prefix', () => {
      expect(normalizeTypeName('APIKey')).toBe('ApiKey')
    })

    it('normalizes HTTP prefix', () => {
      expect(normalizeTypeName('HTTPResponse')).toBe('HttpResponse')
    })

    it('normalizes URL prefix', () => {
      expect(normalizeTypeName('URLConfig')).toBe('UrlConfig')
    })

    it('normalizes ID prefix', () => {
      expect(normalizeTypeName('IDType')).toBe('IdType')
    })

    it('does not change non-prefixed names', () => {
      expect(normalizeTypeName('UserType')).toBe('UserType')
    })

    it('handles multiple normalizations', () => {
      expect(normalizeTypeName('UIAPIConfig')).toBe('UiAPIConfig')
    })
  })

  describe('isValidIdentifier', () => {
    it('returns true for valid identifiers', () => {
      expect(isValidIdentifier('validName')).toBeTruthy()
      expect(isValidIdentifier('_private')).toBeTruthy()
      expect(isValidIdentifier('name123')).toBeTruthy()
    })

    it('returns false for invalid identifiers', () => {
      expect(isValidIdentifier('123name')).toBeFalsy()
      expect(isValidIdentifier('na-me')).toBeFalsy()
      expect(isValidIdentifier('na me')).toBeFalsy()
      expect(isValidIdentifier('na.me')).toBeFalsy()
    })
  })

  describe('safePropName', () => {
    it('returns unquoted name for valid identifiers', () => {
      expect(safePropName('validName')).toBe('validName')
    })

    it('returns quoted name for invalid identifiers', () => {
      expect(safePropName('invalid-name')).toBe('"invalid-name"')
      expect(safePropName('123invalid')).toBe('"123invalid"')
      expect(safePropName('invalid.name')).toBe('"invalid.name"')
    })
  })
})
