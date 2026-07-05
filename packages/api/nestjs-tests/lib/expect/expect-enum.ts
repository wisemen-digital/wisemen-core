import type { ExpectationResult, MatcherFunction } from 'expect'

export const isEnumValue: MatcherFunction<[object]> = function (
  received: unknown,
  type: object
): ExpectationResult {
  if (Object.values(type).includes(received)) {
    return {
      pass: true,
      message: () => `expected ${this.utils.printReceived(received)} not to be of type ${this.utils.printReceived(type)}`
    }
  } else {
    return {
      pass: false,
      message: () => `expected ${this.utils.printReceived(received)} to be of type ${this.utils.printReceived(type)}`
    }
  }
}

declare module 'expect' {
  interface AsymmetricMatchers {
    /**
     * Validate whether the value is of given type.
     */
    isEnumValue: (type: object) => ExpectationResult
  }
  interface Matchers<R> {
    /**
     * Validate whether the value is of given type.
     */
    isEnumValue: (type: object) => R
  }
}
