import { HttpStatus } from '@nestjs/common'
import { CompositeApiError } from './composite.api-error.js'
import { NotFoundApiError } from './not-found.api-error.js'

export class NotFoundCompositeApiError extends CompositeApiError {
  constructor (errors: NotFoundApiError[]) {
    super(HttpStatus.NOT_FOUND, errors)
  }
}
