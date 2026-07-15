import { ApiErrorBuilder } from '@/mocking/errors/apiError.builder'

/**
 * Builds a `400 Bad Request` error response.
 */
export class BadRequestBuilder extends ApiErrorBuilder {
  constructor() {
    super(400, 'bad_request', 'Bad request')
  }
}
