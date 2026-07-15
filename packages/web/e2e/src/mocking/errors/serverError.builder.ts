import { ApiErrorBuilder } from '@/mocking/errors/apiError.builder'

/**
 * Builds a `500 Internal Server Error` error response.
 */
export class ServerErrorBuilder extends ApiErrorBuilder {
  constructor() {
    super(500, 'internal_server_error', 'Internal server error')
  }
}
