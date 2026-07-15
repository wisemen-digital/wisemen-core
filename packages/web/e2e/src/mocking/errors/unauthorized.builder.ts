import { ApiErrorBuilder } from '@/mocking/errors/apiError.builder'

/**
 * Builds a `401 Unauthorized` error response.
 */
export class UnauthorizedBuilder extends ApiErrorBuilder {
  constructor() {
    super(401, 'unauthorized', 'Unauthorized')
  }
}
