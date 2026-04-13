import {
  describe,
  expect,
  it,
} from 'vitest'

import { phoneNumberSchema } from '#/schemas/phone-number/phoneNumber.schema.ts'

describe('phoneNumberSchema', () => {
  it('should validate a valid US phone number', () => {
    const result = phoneNumberSchema.safeParse('+1 (202) 555-0173')

    expect(result.success).toBeTruthy()
  })

  it('should validate a valid international phone number', () => {
    const result = phoneNumberSchema.safeParse('+33 1 42 68 53 00')

    expect(result.success).toBeTruthy()
  })

  it('should validate a valid German phone number', () => {
    const result = phoneNumberSchema.safeParse('+49 30 123456')

    expect(result.success).toBeTruthy()
  })

  it('should reject an empty string', () => {
    const result = phoneNumberSchema.safeParse('')

    expect(result.success).toBeFalsy()
  })

  it('should reject an invalid phone number', () => {
    const result = phoneNumberSchema.safeParse('123')

    expect(result.success).toBeFalsy()
  })

  it('should reject a malformed phone number', () => {
    const result = phoneNumberSchema.safeParse('not a phone number')

    expect(result.success).toBeFalsy()
  })

  it('should reject a phone number with invalid format', () => {
    const result = phoneNumberSchema.safeParse('+1 invalid')

    expect(result.success).toBeFalsy()
  })

  it('should validate phone number with different formatting variations', () => {
    const validFormats = [
      '+12025550173',
      '+1 202 555 0173',
      '+1-202-555-0173',
    ]

    for (const format of validFormats) {
      const result = phoneNumberSchema.safeParse(format)

      expect(result.success).toBeTruthy()
    }
  })

  it('should include error message when validation fails', () => {
    const result = phoneNumberSchema.safeParse('invalid')

    expect(result.success).toBeFalsy()
    expect(result.error!.issues[0].message).toBe(
      'package.zod_validation.invalid_phone_number',
    )
  })
})
