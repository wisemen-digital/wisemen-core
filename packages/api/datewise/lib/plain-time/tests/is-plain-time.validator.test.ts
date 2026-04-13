import { before, describe, it } from 'node:test'
import { validate } from 'class-validator'
import { expect } from 'expect'
import { IsPlainTime } from '../validators/is-plain-time.validator.js'
import { initDayjs } from '../../common/init-dayjs.js'

class TestClass {
  @IsPlainTime()
  timeString: string
}

describe('IsPlainTime decorator test', () => {
  before(() => {
    initDayjs()
  })

  it('should pass validation when the time string is a valid time string', async () => {
    const testInstance = new TestClass()

    testInstance.timeString = '12:00:00'

    const errors = await validate(testInstance)

    expect(errors.length).toBe(0)
  })

  it('should pass validation when the time string is 24:00:00', async () => {
    const testInstance = new TestClass()

    testInstance.timeString = '24:00:00'

    const errors = await validate(testInstance)

    expect(errors.length).toBe(0)
  })

  it('should fail validation when the timestring is invalid', async () => {
    const testInstance = new TestClass()

    testInstance.timeString = 'abc'

    const errors = await validate(testInstance)

    expect(errors.length).toBe(1)
  })
})
