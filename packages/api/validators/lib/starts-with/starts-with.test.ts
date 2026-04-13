import { describe, it } from 'node:test'
import { validate } from 'class-validator'
import { expect } from 'expect'
import { StartsWith } from './starts-with.validator.js'

describe('StartsWith Decorator', () => {
  it('Should throw validator errors when string doesnt start with the value', async () => {
    class TestClass {
      @StartsWith(['be'], false)
      iban: string
    }

    const testInstance = new TestClass()

    testInstance.iban = 'NL1234567890123456789'

    const errors = await validate(testInstance)

    expect(errors.length).toBe(1)
  })

  it('Should throw validator errors when the casing does not match the value', async () => {
    class TestClass {
      @StartsWith(['be'], true)
      iban: string
    }

    const testInstance = new TestClass()

    testInstance.iban = 'BE1234567890123456789'

    const errors = await validate(testInstance)

    expect(errors.length).toBe(1)
  })

  it('Should not throw validator errors when string starts with the value and is case insensitive', async () => {
    class TestClass {
      @StartsWith(['be'], false)
      iban: string
    }

    const testInstance = new TestClass()

    testInstance.iban = 'BE1234567890123456789'

    const errors = await validate(testInstance)

    expect(errors.length).toBe(0)
  })

  it('Should not throw validator errors when string starts with the value and is case sensitive', async () => {
    class TestClass {
      @StartsWith(['BE'], true)
      iban: string
    }

    const testInstance = new TestClass()

    testInstance.iban = 'BE1234567890123456789'

    const errors = await validate(testInstance)

    expect(errors.length).toBe(0)
  })

  it('Should throw validator errors when string starts with the value but doesnt match case sensitive', async () => {
    class TestClass {
      @StartsWith(['BE'], true)
      iban: string
    }

    const testInstance = new TestClass()

    testInstance.iban = 'be1234567890123456789'

    const errors = await validate(testInstance)

    expect(errors.length).toBe(1)
  })

  it('Should not throw validator errors when string starts with one of the values', async () => {
    class TestClass {
      @StartsWith(['be', 'nl'], false)
      iban: string
    }

    const testInstance = new TestClass()

    testInstance.iban = 'NL1234567890123456789'

    const errors = await validate(testInstance)

    expect(errors.length).toBe(0)
  })

  it('Should throw validator errors when string doesnt start with one of the values', async () => {
    class TestClass {
      @StartsWith(['be', 'nl'], false)
      iban: string
    }

    const testInstance = new TestClass()

    testInstance.iban = 'FR1234567890123456789'

    const errors = await validate(testInstance)

    expect(errors.length).toBe(1)
  })
})
