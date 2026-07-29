import { HttpStatus } from '@nestjs/common'
import { describe, it } from 'node:test'
import { expect } from 'expect'
import { ValidationError } from 'class-validator'
import { convertClassValidatorErrorsToJsonApiError } from '../convert-class-validator-errors-to-json-api-error.js'

function createValidationError ({
  property,
  target,
  constraints,
  children = []
}: {
  property: string
  target: object | unknown[]
  constraints?: Record<string, string>
  children?: ValidationError[]
}): ValidationError {
  const error = new ValidationError()

  error.property = property
  error.target = target
  error.constraints = constraints
  error.children = children

  return error
}

describe('convertClassValidatorErrorsToJsonApiError', () => {
  it('converts field constraint errors into json api errors', () => {
    const error = createValidationError({
      property: 'email',
      target: { email: 'invalid' },
      constraints: {
        isEmail: 'email must be an email'
      }
    })

    const jsonApiError = convertClassValidatorErrorsToJsonApiError([error])

    expect(jsonApiError.status).toBe(HttpStatus.BAD_REQUEST)
    expect(jsonApiError.errors).toEqual([
      {
        code: 'validation_error.is_email',
        detail: 'email must be an email',
        source: { pointer: '$.email' },
        status: '400'
      }
    ])
  })

  it('converts nested array validation errors with json path pointers', () => {
    const nestedError = createValidationError({
      property: 'name',
      target: { name: '' },
      constraints: {
        isNotEmpty: 'name should not be empty'
      }
    })
    const arrayItemError = createValidationError({
      property: '0',
      target: [{ name: '' }],
      children: [nestedError]
    })
    const rootError = createValidationError({
      property: 'items',
      target: { items: [{ name: '' }] },
      children: [arrayItemError]
    })

    const jsonApiError = convertClassValidatorErrorsToJsonApiError([rootError])

    expect(jsonApiError.errors).toEqual([
      {
        code: 'validation_error.is_not_empty',
        detail: 'name should not be empty',
        source: { pointer: '$.items[0].name' },
        status: '400'
      }
    ])
  })

  it('keeps multiple constraint errors for the same property', () => {
    const error = createValidationError({
      property: 'name',
      target: { name: '' },
      constraints: {
        isNotEmpty: 'name should not be empty',
        minLength: 'name must be longer than or equal to 3 characters'
      }
    })

    const jsonApiError = convertClassValidatorErrorsToJsonApiError([error])

    expect(jsonApiError.errors).toEqual([
      {
        code: 'validation_error.is_not_empty',
        detail: 'name should not be empty',
        source: { pointer: '$.name' },
        status: '400'
      },
      {
        code: 'validation_error.min_length',
        detail: 'name must be longer than or equal to 3 characters',
        source: { pointer: '$.name' },
        status: '400'
      }
    ])
  })
})
