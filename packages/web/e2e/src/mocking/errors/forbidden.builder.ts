import { ApiErrorBuilder } from '@/mocking/errors/apiError.builder'

/**
 * Builds a `403 Forbidden` error response.
 */
export class ForbiddenBuilder extends ApiErrorBuilder {
  constructor() {
    super(403, 'forbidden', 'Forbidden')
  }
}
