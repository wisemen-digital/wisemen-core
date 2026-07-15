import { ApiErrorBuilder } from '@/mocking/errors/apiError.builder'

/**
 * Builds a `404 Not Found` error response.
 */
export class NotFoundBuilder extends ApiErrorBuilder {
  constructor() {
    super(404, 'not_found', 'Not found')
  }
}
