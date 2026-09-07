import { describe, it } from 'node:test'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { expect } from 'expect'
import { IsPhoneNumber } from './is-phone-number.validator.js'

class TestClass {
  @IsPhoneNumber()
  phone: string
}

class TestClassWithDefaultCountry {
  @IsPhoneNumber({ defaultCountry: 'BE' })
  phone: string
}

describe('IsPhoneNumber Decorator', () => {
  it('normalizes a messy phone number string to E.164 format', () => {
    const testInstance = plainToInstance(TestClass, {
      phone: '+32 0485 23 36 48 dit is een leuk telefoon nummer haha !'
    })

    expect(testInstance.phone).toStrictEqual('+32485233648')
  })

  it('normalizes a phone number with a country code prefix to E.164 format', () => {
    const testInstance = plainToInstance(TestClass, { phone: '+32 11 183 111' })

    expect(testInstance.phone).toStrictEqual('+3211183111')
  })

  it('normalizes a phone number without a country code prefix to E.164 format', () => {
    const testInstance = plainToInstance(TestClassWithDefaultCountry, { phone: '011 183 111' })

    expect(testInstance.phone).toStrictEqual('+3211183111')
  })

  it('keeps the leading 0 and fails validation when there is no country code and no default country', async () => {
    const testInstance = plainToInstance(TestClass, { phone: '011 183 111' })

    expect(testInstance.phone).toStrictEqual('011 183 111')

    const errors = await validate(testInstance)

    expect(errors.length).toBe(1)
  })

  it('should not throw a validation error when input is a valid phone number', async () => {
    const testInstance = plainToInstance(TestClass, { phone: '+32485233648' })

    const errors = await validate(testInstance)

    expect(errors.length).toBe(0)
  })

  it('should throw a validation error when input is not a valid phone number', async () => {
    const testInstance = new TestClass()

    testInstance.phone = 'aa'

    const errors = await validate(testInstance)

    expect(errors.length).toBe(1)
  })
})
