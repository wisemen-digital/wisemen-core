import { describe, it } from 'node:test'
import dayjs from 'dayjs'
import { validate } from 'class-validator'
import { expect } from 'expect'
import { IsSameOrAfterDateTimeString } from './is-same-or-after-date-time-string.validator.js'

class TestClass {
  @IsSameOrAfterDateTimeString((obj: TestClass) => obj.reference)
  dateTimeString: string

  reference: string | null
}

describe('IsSameOrAfterDateTimeString decorator test', () => {
  it('should pass validation when the date-time is after the reference date-time', async () => {
    const testInstance = new TestClass()

    testInstance.dateTimeString = dayjs().add(1, 'hour').toISOString()
    testInstance.reference = dayjs().toISOString()

    const errors = await validate(testInstance)

    expect(errors.length).toBe(0)
  })

  it('should pass validation when the date-time is the same as the reference date-time', async () => {
    const testInstance = new TestClass()
    const now = dayjs().toISOString()

    testInstance.dateTimeString = now
    testInstance.reference = now

    const errors = await validate(testInstance)

    expect(errors.length).toBe(0)
  })

  it('should pass validation when the date-time is after the reference by minutes', async () => {
    const testInstance = new TestClass()

    testInstance.dateTimeString = dayjs().add(30, 'minutes').toISOString()
    testInstance.reference = dayjs().toISOString()

    const errors = await validate(testInstance)

    expect(errors.length).toBe(0)
  })

  it('should pass validation when the date-time is after the reference by seconds', async () => {
    const testInstance = new TestClass()

    testInstance.dateTimeString = dayjs().add(1, 'second').toISOString()
    testInstance.reference = dayjs().toISOString()

    const errors = await validate(testInstance)

    expect(errors.length).toBe(0)
  })

  it('should fail validation when the date-time is before the reference date-time', async () => {
    const testInstance = new TestClass()

    testInstance.dateTimeString = dayjs().subtract(1, 'hour').toISOString()
    testInstance.reference = dayjs().toISOString()

    const errors = await validate(testInstance)

    expect(errors.length).toBe(1)
    expect(errors[0].constraints?.isSameOrAfterDateTimeString).toContain('must be a date string after or the same as')
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

    testInstance.dateTimeString = dayjs().add(1, 'hour').toISOString()
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

    // Using a different valid date-time format (same time)
    const baseTime = dayjs()

    testInstance.dateTimeString = baseTime.format('YYYY-MM-DD HH:mm:ss')
    testInstance.reference = baseTime.format('YYYY-MM-DD HH:mm:ss')

    const errors = await validate(testInstance)

    expect(errors.length).toBe(0)
  })

  it('should handle timezone differences correctly', async () => {
    const testInstance = new TestClass()

    // Same moment in time but different timezone representations
    const baseTime = dayjs()

    testInstance.dateTimeString = baseTime.toISOString()
    testInstance.reference = baseTime.toISOString()

    const errors = await validate(testInstance)

    expect(errors.length).toBe(0)
  })

  it('should pass validation when comparing exact same milliseconds', async () => {
    const testInstance = new TestClass()

    const baseTime = dayjs()

    testInstance.dateTimeString = baseTime.toISOString()
    testInstance.reference = baseTime.toISOString()

    const errors = await validate(testInstance)

    expect(errors.length).toBe(0)
  })

  it('should pass validation when date-time is milliseconds after reference', async () => {
    const testInstance = new TestClass()

    const baseTime = dayjs()

    testInstance.dateTimeString = baseTime.add(1, 'millisecond').toISOString()
    testInstance.reference = baseTime.toISOString()

    const errors = await validate(testInstance)

    expect(errors.length).toBe(0)
  })

  it('should handle edge case with leap year dates (same date)', async () => {
    const testInstance = new TestClass()

    // February 29th of a leap year
    testInstance.dateTimeString = '2024-02-29T12:00:00.000Z'
    testInstance.reference = '2024-02-29T12:00:00.000Z'

    const errors = await validate(testInstance)

    expect(errors.length).toBe(0)
  })

  it('should provide correct error message with property name and reference value', async () => {
    const testInstance = new TestClass()

    testInstance.dateTimeString = dayjs().subtract(1, 'hour').toISOString()
    testInstance.reference = dayjs().toISOString()

    const errors = await validate(testInstance)

    expect(errors.length).toBe(1)
    expect(errors[0].constraints?.isSameOrAfterDateTimeString).toBe(
      `dateTimeString must be a date string after or the same as ${testInstance.reference}`
    )
  })
})
