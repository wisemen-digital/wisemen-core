import type { AsyncExpectationResult, MatcherFunction } from 'expect'
import { validate } from 'class-validator'

export const toHaveValidationErrors: MatcherFunction = async function (
  objectToValidate: object
): AsyncExpectationResult {
  const validationErrors = await validate(
    objectToValidate,
    { whitelist: true, forbidNonWhitelisted: true }
  )

  if (validationErrors.length > 0) {
    return {
      pass: true,
      message: () =>
        `Expected object ${this.utils.printExpected(objectToValidate)} to not have validation errors, but had ${this.utils.printReceived(validationErrors)}.`
    }
  } else {
    return {
      pass: false,
      message: () =>
        `Expected object ${this.utils.printExpected(objectToValidate)} to have at least one validation error, but had none.`
    }
  }
}

declare module 'expect' {
  interface Matchers<R> {
    /**
     * Validate whether the object has validation errors.
     */
    toHaveValidationErrors(): Promise<R>
  }
}
