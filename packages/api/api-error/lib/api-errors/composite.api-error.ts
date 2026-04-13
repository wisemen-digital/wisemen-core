import { HttpStatus } from '@nestjs/common'
import { ApiError } from './api-error.js'
import { JsonApiError } from './json-api-error.type.js'

export abstract class CompositeApiError extends Error {
  public readonly status: HttpStatus
  public readonly errors: ApiError[]

  constructor (status: HttpStatus, errors: ApiError[]) {
    super()
    this.status = status
    this.errors = errors
  }

  add (...errors: ApiError[]) {
    this.errors.push(...errors)
  }

  toJsonApiError (): JsonApiError {
    return new JsonApiError(
      this.status,
      this.errors.map(error => ({
        code: error.code,
        detail: error.detail,
        status: error.status,
        meta: error.meta
      }))
    )
  }
}
