import {
  describe,
  expect,
  it,
} from 'vitest'

import type { ApiExpectedError } from '@/mocking/errors/apiError.builder'
import { BadRequestBuilder } from '@/mocking/errors/badRequest.builder'
import { ConflictBuilder } from '@/mocking/errors/conflict.builder'
import { ForbiddenBuilder } from '@/mocking/errors/forbidden.builder'
import { NotFoundBuilder } from '@/mocking/errors/notFound.builder'
import { ServerErrorBuilder } from '@/mocking/errors/serverError.builder'
import { UnauthorizedBuilder } from '@/mocking/errors/unauthorized.builder'

describe('error response builders', () => {
  it('emits a single default error when nothing is configured', async () => {
    const response = new BadRequestBuilder().build()

    expect(response.status).toBe(400)

    const body = await response.json() as ApiExpectedError

    expect(body.errors).toHaveLength(1)
    expect(body.errors[0]).toEqual({
      code: 'bad_request',
      detail: 'Bad request',
      status: '400',
    })
  })

  it('adds a field-level error with a source pointer', async () => {
    const response = new BadRequestBuilder()
      .withFieldError('email', 'Email already exists')
      .build()

    const body = await response.json() as ApiExpectedError

    expect(body.errors).toEqual([
      {
        code: 'bad_request',
        detail: 'Email already exists',
        source: {
          pointer: 'email',
        },
        status: '400',
      },
    ])
  })

  it('accumulates multiple field errors', async () => {
    const response = new BadRequestBuilder()
      .withFieldError('email', 'Invalid email')
      .withFieldError('name', 'Name is required')
      .build()

    const body = await response.json() as ApiExpectedError

    expect(body.errors).toHaveLength(2)
    expect(body.errors.map((error) => error.source?.pointer)).toEqual([
      'email',
      'name',
    ])
  })

  it('sets a top-level message via withMessage', async () => {
    const response = new ForbiddenBuilder()
      .withMessage('You do not have permission')
      .build()

    expect(response.status).toBe(403)

    const body = await response.json() as ApiExpectedError

    expect(body.errors[0]?.detail).toBe('You do not have permission')
    expect(body.errors[0]?.source).toBeUndefined()
  })

  it('overrides the error code via withCode', async () => {
    const response = new BadRequestBuilder()
      .withMessage('Custom')
      .withCode('custom_code')
      .build()

    const body = await response.json() as ApiExpectedError

    expect(body.errors[0]?.code).toBe('custom_code')
  })

  it('maps each builder to the correct status and code', async () => {
    const cases = [
      {
        builder: new UnauthorizedBuilder(),
        code: 'unauthorized',
        status: 401,
      },
      {
        builder: new ForbiddenBuilder(),
        code: 'forbidden',
        status: 403,
      },
      {
        builder: new NotFoundBuilder(),
        code: 'not_found',
        status: 404,
      },
      {
        builder: new ConflictBuilder(),
        code: 'conflict',
        status: 409,
      },
      {
        builder: new ServerErrorBuilder(),
        code: 'internal_server_error',
        status: 500,
      },
    ]

    for (const testCase of cases) {
      const response = testCase.builder.build()

      expect(response.status).toBe(testCase.status)

      const body = await response.json() as ApiExpectedError

      expect(body.errors[0]?.code).toBe(testCase.code)
      expect(body.errors[0]?.status).toBe(String(testCase.status))
    }
  })
})
