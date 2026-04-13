import { describe, it } from 'node:test'
import dayjs from 'dayjs'
import { validate } from 'class-validator'
import { expect } from 'expect'
import { IsDateWithoutTimeString } from './is-date-without-time-string.validator.js'

class TestClass {
  @IsDateWithoutTimeString()
  date: string
}

class InfinityTestClass {
  @IsDateWithoutTimeString({ allowInfinity: true })
  date: string
}

describe('IsDateWithoutTimeString decorator', () => {
  describe('IsDateWithoutTimeString decorator Test', () => {
    it('should pass validation when the date has no time', async () => {
      const testInstance = new TestClass()

      testInstance.date = dayjs().subtract(1, 'day').format('YYYY-MM-DD')

      const errors = await validate(testInstance)

      expect(errors.length).toBe(0)
    })

    it('should fail validation when the date has a time', async () => {
      const testInstance = new TestClass()

      testInstance.date = dayjs().subtract(1, 'day').toISOString()

      const errors = await validate(testInstance)

      expect(errors.length).toBe(1)
    })

    it('allows infinity', async () => {
      const testInstance = new InfinityTestClass()

      testInstance.date = 'infinity'

      const errors = await validate(testInstance)

      expect(errors.length).toBe(0)
    })

    it('rejects other strings', async () => {
      const testInstance = new InfinityTestClass()

      testInstance.date = 'inf'

      const errors = await validate(testInstance)

      expect(errors.length).toBe(1)
    })

    it('rejects infinity', async () => {
      const testInstance = new TestClass()

      testInstance.date = 'infinity'

      const errors = await validate(testInstance)

      expect(errors.length).toBe(1)
    })

    it('rejects -infinity', async () => {
      const testInstance = new TestClass()

      testInstance.date = '-infinity'

      const errors = await validate(testInstance)

      expect(errors.length).toBe(1)
    })

    it('allows -infinity', async () => {
      const testInstance = new InfinityTestClass()

      testInstance.date = 'infinity'

      const errors = await validate(testInstance)

      expect(errors.length).toBe(0)
    })

    it('rejects +infinity', async () => {
      const testInstance = new TestClass()

      testInstance.date = '+infinity'

      const errors = await validate(testInstance)

      expect(errors.length).toBe(1)
    })

    it('allows +infinity', async () => {
      const testInstance = new InfinityTestClass()

      testInstance.date = '+infinity'

      const errors = await validate(testInstance)

      expect(errors.length).toBe(0)
    })
  })
})
