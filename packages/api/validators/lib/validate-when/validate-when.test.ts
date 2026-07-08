import { describe, it } from 'node:test'
import { IsDefined, IsString, MinLength, validate } from 'class-validator'
import { expect } from 'expect'
import { ValidateWhen } from './validate-when.validator.js'

class TestClass {
  @IsDefined()
  @ValidateWhen([
    IsString(),
    MinLength(3)
  ], (obj: TestClass) => obj.shouldValidate)
  value: unknown

  shouldValidate: boolean
}

describe('ValidateWhen decorator test', () => {
  it('should skip wrapped validators when the condition is false', async () => {
    const testInstance = new TestClass()

    testInstance.value = 1
    testInstance.shouldValidate = false

    const errors = await validate(testInstance)

    expect(errors.length).toBe(0)
  })

  it('should still execute other validators on the property when the condition is false', async () => {
    const testInstance = new TestClass()

    testInstance.shouldValidate = false

    const errors = await validate(testInstance)

    expect(errors.length).toBe(1)
  })

  it('should execute the wrapped validators when the condition is true', async () => {
    const testInstance = new TestClass()

    testInstance.value = 1
    testInstance.shouldValidate = true

    const errors = await validate(testInstance)

    expect(errors.length).toBe(1)
    expect(errors[0].constraints?.validateWhen).toContain('must be a string')
  })

  it('should pass validation when the wrapped validators succeed', async () => {
    const testInstance = new TestClass()

    testInstance.value = 'valid'
    testInstance.shouldValidate = true

    const errors = await validate(testInstance)

    expect(errors.length).toBe(0)
  })
})
