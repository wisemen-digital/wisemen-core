import { before, describe, it } from 'node:test'
import { validate } from 'class-validator'
import { expect } from 'expect'
import { IsPlainTimeAfter } from '../validators/is-plain-time-after.validator.js'
import { initDayjs } from '../../common/init-dayjs.js'

class TestClass {
  @IsPlainTimeAfter((obj: TestClass) => obj.reference)
  timeString: string

  reference: string
}

describe('IsPlainTimeAfter decorator test', () => {
  before(() => {
    initDayjs()
  })

  it('should pass validation when the time is after the reference', async () => {
    const testInstance = new TestClass()

    testInstance.timeString = '12:00:00'
    testInstance.reference = '11:00:00'

    const errors = await validate(testInstance)

    expect(errors.length).toBe(0)
  })

  it('should fail validation when the time is before the reference', async () => {
    const testInstance = new TestClass()

    testInstance.timeString = '11:00:00'
    testInstance.reference = '12:00:00'

    const errors = await validate(testInstance)

    expect(errors.length).toBe(1)
  })

  it('should fail validation when the time is same as the reference', async () => {
    const testInstance = new TestClass()

    testInstance.timeString = '11:00:00'
    testInstance.reference = '11:00:00'

    const errors = await validate(testInstance)

    expect(errors.length).toBe(1)
  })
})
