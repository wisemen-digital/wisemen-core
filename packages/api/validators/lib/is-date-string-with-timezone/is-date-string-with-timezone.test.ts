import { describe, it } from 'node:test'
import { validate } from 'class-validator'
import { expect } from 'expect'
import { IsDateStringWithTimezone } from './is-date-string-with-timezone.validator.js'

class TestClass {
  @IsDateStringWithTimezone()
  date: string
}

class StrictTestClass {
  @IsDateStringWithTimezone({ strict: true })
  date: string
}

describe('IsDateStringWithTimezone decorator test', () => {
  it('should fail validation when the date string is invalid', async () => {
    const testInstance = new TestClass()

    testInstance.date = 'invalid-date-string'

    const errors = await validate(testInstance)

    expect(errors.length).toBe(1)
    expect(errors[0].constraints?.isDateString).toBeDefined()
  })

  it('should fail validation when the date string is empty', async () => {
    const testInstance = new TestClass()

    testInstance.date = ''

    const errors = await validate(testInstance)

    expect(errors.length).toBe(1)
    expect(errors[0].constraints?.isDateString).toBeDefined()
  })

  it('should fail validation when the valid date string has no timezone', async () => {
    const testInstance = new TestClass()

    testInstance.date = '2024-01-01T12:34:56'

    const errors = await validate(testInstance)

    expect(errors.length).toBe(1)
    expect(errors[0].constraints?.matches).toBeDefined()
  })

  it('should pass validation when the valid date string has a Z timezone', async () => {
    const testInstance = new TestClass()

    testInstance.date = '2024-01-01T12:34:56Z'

    const errors = await validate(testInstance)

    expect(errors.length).toBe(0)
  })

  it('should pass validation when the valid date string has an offset timezone', async () => {
    const testInstance = new TestClass()

    testInstance.date = '2024-01-01T12:34:56+02:00'

    const errors = await validate(testInstance)

    expect(errors.length).toBe(0)
  })

  it('should fail validation when the timezone uses an unsupported compact offset', async () => {
    const testInstance = new TestClass()

    testInstance.date = '2024-01-01T12:34:56+0200'

    const errors = await validate(testInstance)

    expect(errors.length).toBe(1)
    expect(errors[0].constraints?.matches).toBeDefined()
  })

  it('should fail validation when the value is not a string', async () => {
    const testInstance = new TestClass()

    testInstance.date = 42 as unknown as string

    const errors = await validate(testInstance)

    expect(errors.length).toBe(1)
  })

  it('should forward IsDateString options', async () => {
    const testInstance = new StrictTestClass()

    testInstance.date = '2019-02-29T12:00:00Z'

    const errors = await validate(testInstance)

    expect(errors.length).toBe(1)
    expect(errors[0].constraints?.isDateString).toBeDefined()
  })
})
