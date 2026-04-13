import { HttpStatus } from '@nestjs/common'
import { CompositeApiError } from './composite.api-error.js'
import { BadRequestApiError } from './bad-request.api-error.js'

export class BadRequestCompositeApiError extends CompositeApiError {
  constructor (errors: BadRequestApiError[]) {
    super(HttpStatus.BAD_REQUEST, errors)
  }
}
