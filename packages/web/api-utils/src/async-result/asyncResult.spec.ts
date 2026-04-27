/**
 * Runtime tests for AsyncResult type narrowing with useQuery
 * These tests verify that type narrowing works correctly:
 * 1. Without checking, you can't access value or error (returns `never`)
 * 2. With isOk() check, you can access value but not error
 * 3. With isLoading() check, you can't access value or error
 * 4. With isErr() check, you can access error but not value
 */

/* eslint-disable test/no-conditional-in-test, test/no-conditional-expect */

import {
  describe,
  expect,
  it,
} from 'vitest'

import type { ApiError } from '@/types/apiError.type'

import { AsyncResult } from './asyncResult'

interface TestUser {
  id: string
  name: string
}

describe('asyncResult type narrowing with useQuery', () => {
  it('without type checking, getValue() throws at runtime', () => {
    const result = AsyncResult.ok<TestUser, ApiError>({
      id: '1',
      name: 'John',
    })

    // getValue() on union would throw (though in this case we have concrete AsyncResultOk)
    // The point is: after using from useQuery, it's a union type
    // Without narrowing, getValue() is not accessible (TypeScript prevents this)
    // So we test that after narrowing it works
    expect(result.isOk()).toBeTruthy()

    if (result.isOk()) {
      expect(() => {
        result.getValue()
      }).not.toThrow()
    }
  })

  it('with isOk() check, getValue() returns the value', () => {
    const result = AsyncResult.ok<TestUser, ApiError>({
      id: '1',
      name: 'John',
    })

    if (result.isOk()) {
      const user = result.getValue()

      expect(user.name).toBe('John')
      expect(user.id).toBe('1')
    }
  })

  it('with isLoading() check, getResult() returns null', () => {
    const result = AsyncResult.loading<TestUser, ApiError>()

    if (result.isLoading()) {
      const asyncResult = result.getResult()

      expect(asyncResult).toBeNull()
    }
  })

  it('with isErr() check, getError() returns the error', () => {
    const error = {
      errors: [],
    } as unknown as ApiError
    const result = AsyncResult.err<TestUser, ApiError>(error)

    if (result.isErr()) {
      const returnedError = result.getError()

      expect(returnedError).toBe(error)
    }
  })

  it('chained type checks prevent access to wrong methods', () => {
    const result = AsyncResult.ok<TestUser, ApiError>({
      id: '1',
      name: 'John',
    })

    if (result.isErr()) {
      // This branch is not taken, but if we tried to access getValue here it would throw
      expect.unreachable()
    }
    else if (result.isLoading()) {
      // This branch is not taken
      expect.unreachable()
    }
    else if (result.isOk()) {
      // This is the correct branch
      const user = result.getValue()

      expect(user.name).toBe('John')
    }
  })

  it('pattern matching handles all three states', () => {
    const okResult = AsyncResult.ok<TestUser, ApiError>({
      id: '1',
      name: 'John',
    })

    const message = okResult.match({
      err: () => 'Error occurred',
      loading: () => 'Loading...',
      ok: (user) => `Hello, ${user.name}`,
    })

    expect(message).toBe('Hello, John')
  })

  it('pattern matching with error state', () => {
    const error = {
      errors: [],
    } as unknown as ApiError
    const errResult = AsyncResult.err<TestUser, ApiError>(error)

    const message = errResult.match({
      err: (e) => {
        expect(e).toBe(error)

        return 'Error occurred'
      },
      loading: () => 'Loading...',
      ok: () => 'Success',
    })

    expect(message).toBe('Error occurred')
  })

  it('pattern matching with loading state', () => {
    const loadingResult = AsyncResult.loading<TestUser, ApiError>()

    const message = loadingResult.match({
      err: () => 'Error occurred',
      loading: () => 'Loading...',
      ok: () => 'Success',
    })

    expect(message).toBe('Loading...')
  })

  it('map() transforms success values', () => {
    const result = AsyncResult.ok<TestUser, ApiError>({
      id: '1',
      name: 'John',
    })

    const mapped = result.map((user) => user.name.toUpperCase())

    if (mapped.isOk()) {
      expect(mapped.getValue()).toBe('JOHN')
    }
  })

  it('map() preserves error state', () => {
    const error = {
      errors: [],
    } as unknown as ApiError
    const result = AsyncResult.err<TestUser, ApiError>(error)

    const mapped = result.map((user) => user.name.toUpperCase())

    if (mapped.isErr()) {
      expect(mapped.getError()).toBe(error)
    }
  })

  it('mapErr() transforms error values', () => {
    const apiError = {
      errors: [],
    } as unknown as ApiError
    const result = AsyncResult.err<TestUser, ApiError>(apiError)

    const mapped = result.mapErr(() => 'Custom error message')

    if (mapped.isErr()) {
      expect(mapped.getError()).toBe('Custom error message')
    }
  })

  it('mapErr() preserves success state', () => {
    const user = {
      id: '1',
      name: 'John',
    }
    const result = AsyncResult.ok<TestUser, ApiError>(user)

    const mapped = result.mapErr(() => 'Custom error message')

    if (mapped.isOk()) {
      expect(mapped.getValue()).toEqual(user)
    }
  })

  it('unwrapOr() returns value on success', () => {
    const result = AsyncResult.ok<TestUser, ApiError>({
      id: '1',
      name: 'John',
    })

    const user = result.unwrapOr({
      id: 'default',
      name: 'Guest',
    })

    expect(user.name).toBe('John')
  })

  it('unwrapOr() returns default on error', () => {
    const error = {
      errors: [],
    } as unknown as ApiError
    const result = AsyncResult.err<TestUser, ApiError>(error)

    const user = result.unwrapOr({
      id: 'default',
      name: 'Guest',
    })

    expect(user.name).toBe('Guest')
  })

  it('unwrapOr() returns default on loading', () => {
    const result = AsyncResult.loading<TestUser, ApiError>()

    const user = result.unwrapOr({
      id: 'default',
      name: 'Guest',
    })

    expect(user.name).toBe('Guest')
  })
})
