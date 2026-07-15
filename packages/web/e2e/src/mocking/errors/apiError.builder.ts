import type { StrictResponse } from 'msw'
import { HttpResponse } from 'msw'

/**
 * A single API error entry, matching the error shape emitted by
 * `@wisemen/vue-core-api-utils`.
 */
export interface ApiErrorObject {
  code: string
  detail: string
  source?: { pointer: string }
  /** The HTTP status as a string, e.g. `'400'`. */
  status: string
}

/**
 * The full error response body: a list of {@link ApiErrorObject}.
 */
export interface ApiExpectedError {
  errors: ApiErrorObject[]
}

/**
 * Base builder for MSW error responses that conform to the
 * `@wisemen/vue-core-api-utils` error shape.
 *
 * Concrete subclasses fix the HTTP status, default code, and default
 * detail via `super(...)`. Consumers chain `withMessage`, `withCode`, and
 * `withFieldError`, then call `build()` to obtain an `HttpResponse`.
 */
export abstract class ApiErrorBuilder {
  private codeOverride: string | null = null
  private readonly defaultCode: string
  private readonly defaultDetail: string

  private readonly errors: ApiErrorObject[] = []

  private readonly status: number

  protected constructor(status: number, defaultCode: string, defaultDetail: string) {
    this.status = status
    this.defaultCode = defaultCode
    this.defaultDetail = defaultDetail
  }

  /**
   * Build the MSW error response. If no errors were added, a single
   * default error is emitted using the (optionally overridden) code and
   * the default detail for this status.
   */
  build(): StrictResponse<ApiExpectedError> {
    const errors: ApiErrorObject[] = this.errors.length > 0
      ? this.errors
      : [
          {
            code: this.codeOverride ?? this.defaultCode,
            detail: this.defaultDetail,
            status: String(this.status),
          },
        ]

    return HttpResponse.json<ApiExpectedError>({
      errors,
    }, {
      status: this.status,
    })
  }

  /**
   * Override the code used for generic errors. If errors already exist,
   * the last one's code is updated too.
   */
  withCode(code: string): this {
    this.codeOverride = code

    const lastError = this.errors.at(-1)

    if (lastError !== undefined) {
      lastError.code = code
    }

    return this
  }

  /**
   * Push a field-level error with a JSON pointer source.
   */
  withFieldError(pointer: string, detail: string): this {
    this.errors.push({
      code: this.codeOverride ?? this.defaultCode,
      detail,
      source: {
        pointer,
      },
      status: String(this.status),
    })

    return this
  }

  /**
   * Push a top-level error with the given detail (no source pointer).
   */
  withMessage(detail: string): this {
    this.errors.push({
      code: this.codeOverride ?? this.defaultCode,
      detail,
      status: String(this.status),
    })

    return this
  }
}
