import type { ExpectationResult, MatcherFunction } from 'expect'

export const toHaveErrorCode: MatcherFunction<[code: string]> = function (
  response: { status?: unknown, body?: { errors?: Array<{ code?: unknown }> } },
  code: string
): ExpectationResult {
  const errors = response.body?.errors
  const errorCodes = Array.from(new Set(errors?.map(error => error.code) ?? []))
  const someErrorHasExpectedCode = errors?.some(error => error.code === code) === true

  if (someErrorHasExpectedCode) {
    return {
      pass: true,
      message: () =>
        `expected errors ${this.utils.printReceived(errorCodes)} not to include `
        + `code ${this.utils.printExpected(code)}.`
    }
  } else {
    return {
      pass: false,
      message: () =>
        `expected errors ${this.utils.printReceived(errorCodes)} to include `
        + `code ${this.utils.printExpected(code)}.`
    }
  }
}

declare module 'expect' {
  interface AsymmetricMatchers {
    /**
     * Validate whether the value is a string that
     * represents a uuid.
     */
    toHaveErrorCode: (code: string) => ExpectationResult
  }
  interface Matchers<R> {
    /**
     * Validate whether the value is a string that
     * represents a uuid.
     */
    toHaveErrorCode: (code: string) => R
  }
}
