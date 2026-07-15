import { ApiErrorBuilder } from '@/mocking/errors/apiError.builder'

/**
 * Builds a `409 Conflict` error response.
 */
export class ConflictBuilder extends ApiErrorBuilder {
  constructor() {
    super(409, 'conflict', 'Conflict')
  }
}
