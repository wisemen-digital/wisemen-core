/* eslint-disable ts/no-use-before-define */
import type { Result } from 'neverthrow'
import {
  Err,
  err,
  Ok,
  ok,
} from 'neverthrow'

/**
 * Base class for AsyncResult - internal use only.
 * Use AsyncResult<T, E> as the public type.
 */
abstract class AsyncResultBase<T, E> {
  protected readonly _error: E | undefined
  protected readonly _status: 'err' | 'loading' | 'ok'
  protected readonly _value: T | undefined

  protected constructor(status: 'err' | 'loading' | 'ok', value?: T, error?: E) {
    this._status = status
    this._value = value
    this._error = error
  }

  /**
   * Check if the result is an error (type predicate for narrowing)
   */
  isErr(): this is AsyncResultErr<T, E> {
    return this._status === 'err'
  }

  /**
   * Check if the result is in loading state (type predicate for narrowing)
   */
  isLoading(): this is AsyncResultLoading<T, E> {
    return this._status === 'loading'
  }

  /**
   * Check if the result is a success (type predicate for narrowing)
   */
  isOk(): this is AsyncResultOk<T, E> {
    return this._status === 'ok'
  }

  /**
   * Map the success value to a new value
   */
  map<U>(fn: (value: T) => U): AsyncResult<U, E> {
    if (this._status === 'loading') {
      return AsyncResult.loading()
    }

    if (this._status === 'ok') {
      return AsyncResult.ok(fn(this._value as T))
    }

    return AsyncResult.err(this._error as E)
  }

  /**
   * Map the error to a new error
   */
  mapErr<F>(fn: (error: E) => F): AsyncResult<T, F> {
    if (this._status === 'loading') {
      return AsyncResult.loading()
    }

    if (this._status === 'err') {
      return AsyncResult.err(fn(this._error as E))
    }

    return AsyncResult.ok(this._value as T)
  }

  /**
   * Pattern match on all three states
   */
  match<U>(handlers: {
    err: (error: E) => U
    loading: () => U
    ok: (value: T) => U
  }): U {
    if (this._status === 'loading') {
      return handlers.loading()
    }

    if (this._status === 'ok') {
      return handlers.ok(this._value as T)
    }

    return handlers.err(this._error as E)
  }

  /**
   * Get the success value, or return null if loading or error.
   * Returns T | null when null is passed as the default value.
   */
  unwrapOr(defaultValue: null): T | null
  /**
   * Get the success value, or return the default value of type T if loading or error.
   * Returns T when a value of type T is passed as the default value.
   */
  unwrapOr(defaultValue: T): T
  unwrapOr(defaultValue: T | null): T | null {
    if (this._status === 'ok') {
      return this._value as T
    }

    return defaultValue
  }
}

/**
 * AsyncResult representing an error state
 */
export class AsyncResultErr<T, E> extends AsyncResultBase<T, E> {
  private constructor(error: E) {
    super('err', undefined, error)
  }

  /** @internal */
  static _create<T, E>(error: E): AsyncResultErr<T, E> {
    return new AsyncResultErr<T, E>(error)
  }

  /** Get the error value - only available after isErr() check */
  getError(): E {
    return this._error as E
  }

  getResult(): Result<T, E> {
    return err(this._error as E)
  }
}

/**
 * AsyncResult representing a loading state
 */
export class AsyncResultLoading<T, E> extends AsyncResultBase<T, E> {
  private constructor() {
    super('loading')
  }

  /** @internal */
  static _create<T, E>(): AsyncResultLoading<T, E> {
    return new AsyncResultLoading<T, E>()
  }

  getResult(): null {
    return null
  }
}

/**
 * AsyncResult representing a success state
 */

export class AsyncResultOk<T, E> extends AsyncResultBase<T, E> {
  private constructor(value: T) {
    super('ok', value)
  }

  /** @internal */
  static _create<T, E>(value: T): AsyncResultOk<T, E> {
    return new AsyncResultOk<T, E>(value)
  }

  getResult(): Result<T, E> {
    return ok(this._value as T)
  }

  /** Get the success value - only available after isOk() check */
  getValue(): T {
    return this._value as T
  }
}

/**
 * Union type of all AsyncResult states.
 * Use isOk(), isErr(), or isLoading() to narrow to specific state.
 */
export type AsyncResult<T, E> = AsyncResultErr<T, E> | AsyncResultLoading<T, E> | AsyncResultOk<T, E>

/**
 * Static factory methods for creating AsyncResult instances.
 * This pattern (same name for type and value) is intentional for ergonomic API.
 */
// eslint-disable-next-line ts/no-redeclare
export const AsyncResult = {
  /**
   * Create a failed AsyncResult with error
   */
  err<T, E>(error: E): AsyncResultErr<T, E> {
    return AsyncResultErr._create<T, E>(error)
  },

  /**
   * Create an AsyncResult from an existing neverthrow Result
   */
  fromResult<T, E>(result: Result<T, E>): AsyncResult<T, E> {
    if (result.isOk()) {
      return AsyncResult.ok(result.value)
    }

    return AsyncResult.err(result.error)
  },

  /**
   * Create a loading AsyncResult
   */
  loading<T, E>(): AsyncResultLoading<T, E> {
    return AsyncResultLoading._create<T, E>()
  },

  /**
   * Create a successful AsyncResult with data
   */
  ok<T, E>(value: T): AsyncResultOk<T, E> {
    return AsyncResultOk._create<T, E>(value)
  },
} as const

export function isAsyncResult<T = unknown, E = unknown>(value: unknown): value is AsyncResult<T, E> {
  return value instanceof AsyncResultErr
    || value instanceof AsyncResultLoading
    || value instanceof AsyncResultOk
}

export function isResult<T, E>(value: unknown): value is Result<T, E> {
  return value instanceof Ok || value instanceof Err
}
