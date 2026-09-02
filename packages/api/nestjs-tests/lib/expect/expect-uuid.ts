import { isUUID } from 'class-validator'
import type { ExpectationResult, MatcherFunction } from 'expect'

export const uuid: MatcherFunction = function (received: unknown): ExpectationResult {
  if (isUUID(received)) {
    return {
      pass: true,
      message: () => `expected ${this.utils.printReceived(received)} not to be a uuid`
    }
  } else {
    return {
      pass: false,
      message: () => `expected ${this.utils.printReceived(received)} to be a uuid`
    }
  }
}

declare module 'expect' {
  interface AsymmetricMatchers {
    /**
     * Validate whether the value is a string that
     * represents a uuid.
     */
    uuid: () => ExpectationResult
  }
  interface Matchers<R> {
    /**
     * Validate whether the value is a string that
     * represents a uuid.
     */
    toBeUuid: () => R
  }
}
