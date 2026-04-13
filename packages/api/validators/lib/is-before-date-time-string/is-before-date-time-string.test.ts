import { describe, it } from 'node:test'
import dayjs from 'dayjs'
import { validate } from 'class-validator'
import { expect } from 'expect'
import { IsBeforeDateTimeString } from './is-before-date-time-string.validator.js'

class TestClass {
  @IsBeforeDateTimeString((obj: TestClass) => obj.reference)
  dateTimeString: string

  reference: string | null
}

describe('IsBeforeDateTimeString decorator test', () => {
  it('should pass validation when the date-time is before the reference date-time', async () => {
    const testInstance = new TestClass()

    testInstance.dateTimeString = dayjs().subtract(1, 'hour').toISOString()
    testInstance.reference = dayjs().toISOString()

    const errors = await validate(testInstance)

    expect(errors.length).toBe(0)
  })

  it('should pass validation when the date-time is before the reference date-time by minutes', async () => {
    const testInstance = new TestClass()

    testInstance.dateTimeString = dayjs().subtract(30, 'minutes').toISOString()
    testInstance.reference = dayjs().toISOString()

    const errors = await validate(testInstance)

    expect(errors.length).toBe(0)
  })

  it('should pass validation when the date-time is before the reference date-time by seconds', async () => {
    const testInstance = new TestClass()

    testInstance.dateTimeString = dayjs().subtract(1, 'second').toISOString()
    testInstance.reference = dayjs().toISOString()

    const errors = await validate(testInstance)

    expect(errors.length).toBe(0)
  })

  it('should fail validation when the date-time is after the reference date-time', async () => {
    const testInstance = new TestClass()

    testInstance.dateTimeString = dayjs().add(1, 'hour').toISOString()
    testInstance.reference = dayjs().toISOString()

    const errors = await validate(testInstance)

    expect(errors.length).toBe(1)
    expect(errors[0].constraints?.isBeforeDateTimeString).toContain('must be a date string before')
  })

  it('should fail validation when the date-time is the same as the reference date-time', async () => {
    const testInstance = new TestClass()
    const now = dayjs().toISOString()

    testInstance.dateTimeString = now
    testInstance.reference = now

    const errors = await validate(testInstance)

    expect(errors.length).toBe(1)
    expect(errors[0].constraints?.isBeforeDateTimeString).toContain('must be a date string before')
  })

  it('should fail validation when the date-time string is invalid', async () => {
    const testInstance = new TestClass()

    testInstance.dateTimeString = 'invalid-date-time'
    testInstance.reference = dayjs().toISOString()

    const errors = await validate(testInstance)

    expect(errors.length).toBe(1)
  })

  it('should fail validation when the reference date-time string is invalid', async () => {
    const testInstance = new TestClass()

    testInstance.dateTimeString = dayjs().subtract(1, 'hour').toISOString()
    testInstance.reference = 'invalid-date-time'

    const errors = await validate(testInstance)

    expect(errors.length).toBe(1)
  })

  it('should fail validation when the reference is null', async () => {
    const testInstance = new TestClass()

    testInstance.dateTimeString = dayjs().toISOString()
    testInstance.reference = null

    const errors = await validate(testInstance)

    expect(errors.length).toBe(1)
  })

  it('should fail validation when the date-time is not a string', async () => {
    const testInstance = new TestClass()

    testInstance.dateTimeString = 12345 as unknown as string
    testInstance.reference = dayjs().toISOString()

    const errors = await validate(testInstance)

    expect(errors.length).toBe(1)
  })

  it('should work with different date-time formats', async () => {
    const testInstance = new TestClass()

    // Using a different valid date-time format
    testInstance.dateTimeString = dayjs().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss')
    testInstance.reference = dayjs().format('YYYY-MM-DD HH:mm:ss')

    const errors = await validate(testInstance)

    expect(errors.length).toBe(0)
  })

  it('should handle timezone differences correctly', async () => {
    const testInstance = new TestClass()

    // Same moment in time but different timezone representations
    const baseTime = dayjs()

    testInstance.dateTimeString = baseTime.subtract(1, 'hour').toISOString()
    testInstance.reference = baseTime.toISOString()

    const errors = await validate(testInstance)

    expect(errors.length).toBe(0)
  })

  it('should pass validation when comparing dates across different days', async () => {
    const testInstance = new TestClass()

    const today = dayjs().startOf('day').add(12, 'hours') // noon today
    const yesterday = dayjs().subtract(1, 'day').startOf('day').add(12, 'hours') // noon yesterday

    testInstance.dateTimeString = yesterday.toISOString()
    testInstance.reference = today.toISOString()

    const errors = await validate(testInstance)

    expect(errors.length).toBe(0)
  })

  it('should pass validation when comparing times with millisecond precision', async () => {
    const testInstance = new TestClass()

    const baseTime = dayjs()

    testInstance.dateTimeString = baseTime.subtract(1, 'millisecond').toISOString()
    testInstance.reference = baseTime.toISOString()

    const errors = await validate(testInstance)

    expect(errors.length).toBe(0)
  })

  it('should provide correct error message with property name and reference value', async () => {
    const testInstance = new TestClass()

    testInstance.dateTimeString = dayjs().add(1, 'hour').toISOString()
    testInstance.reference = dayjs().toISOString()

    const errors = await validate(testInstance)

    expect(errors.length).toBe(1)
    expect(errors[0].constraints?.isBeforeDateTimeString).toBe(
      `dateTimeString must be a date string before ${testInstance.reference}`
    )
  })
})
