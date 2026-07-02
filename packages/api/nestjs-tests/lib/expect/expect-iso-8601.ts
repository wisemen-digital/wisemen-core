import type { ExpectationResult, MatcherFunction } from 'expect'
import { isISO8601 } from 'class-validator'

export const ISO8601: MatcherFunction = function (received: unknown): ExpectationResult {
  if (isISO8601(received)) {
    return {
      pass: true,
      message: () => `expected ${this.utils.printReceived(received)} not to be an ISO8601 string`
    }
  } else {
    return {
      pass: false,
      message: () => `expected ${this.utils.printReceived(received)} to be an ISO8601 string`
    }
  }
}

declare module 'expect' {
  interface AsymmetricMatchers {
    /**
     * Validate whether the value is a valid ISO8601
     */
    ISO8601: () => ExpectationResult
  }
  interface Matchers<R> {
    /**
     * Validate whether the value is a valid ISO8601
     */
    ISO8601: () => R
  }
}
