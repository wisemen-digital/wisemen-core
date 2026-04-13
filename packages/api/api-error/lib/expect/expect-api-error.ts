import type { ExpectationResult, MatcherFunction } from 'expect'
import { isArray } from 'class-validator'
import { ApiError } from '../api-errors/api-error.js'

export const toHaveApiError: MatcherFunction<[ApiError]>
  = function (received: { body?: { errors?: unknown } }, error: ApiError): ExpectationResult {
    const expectedError = {
      code: error.code,
      status: error.status,
      detail: error.detail,
      meta: error.meta
    }

    const errors = received.body?.errors ?? []
    const errorExists = isArray(errors) && errors.some(error => this.equals(expectedError, error))

    if (errorExists) {
      const stringifiedActual = this.utils.printReceived(errors)
      const stringifiedExpected = this.utils.printReceived({ errors: [expectedError] })

      return {
        pass: true,
        message: () => `expected ${stringifiedActual} not to be ${stringifiedExpected}`
      }
    } else {
      return {
        pass: false,
        message: () => '\n' + this.utils.printDiffOrStringify(
          { errors: [expectedError] },
          errors,
          'Expected',
          'Received',
          false
        )
      }
    }
  }

declare module 'expect' {
  interface AsymmetricMatchers {
    toHaveApiError: (error: ApiError) => ExpectationResult
  }
  interface Matchers<R> {
    toHaveApiError: (error: ApiError) => R
  }
}
