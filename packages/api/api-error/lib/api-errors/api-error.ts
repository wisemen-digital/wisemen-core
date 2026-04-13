import { ApiProperty } from '@nestjs/swagger'
import { JsonApiError } from './json-api-error.type.js'

export abstract class ApiError extends Error {
  readonly abstract code: string
  readonly abstract status: string
  readonly abstract meta: unknown

  @ApiProperty({
    required: false,
    description: 'a human-readable explanation specific to this occurrence of the problem'
  })
  readonly detail?: string

  protected constructor (detail: string) {
    super()
    this.detail = detail
  }

  toJsonApiError (): JsonApiError {
    return new JsonApiError(
      Number(this.status),
      [
        {
          code: this.code,
          detail: this.detail,
          status: this.status,
          meta: this.meta
        }
      ]
    )
  }
}
