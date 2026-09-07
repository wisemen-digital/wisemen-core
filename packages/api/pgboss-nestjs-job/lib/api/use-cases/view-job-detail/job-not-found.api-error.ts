import { ApiErrorCode, NotFoundApiError } from '@wisemen/api-error'

export class JobNotFoundError extends NotFoundApiError {
  @ApiErrorCode('job_not_found')
  code = 'job_not_found'

  meta: unknown

  constructor () {
    super('Job not found')
  }
}
