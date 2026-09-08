import { NotFoundApiError } from '@wisemen/api-error'
import { ApiErrorCode } from '@wisemen/api-error'
import type { RoleUuid } from '../entity/role.uuid.js'

export class RoleNotFoundError extends NotFoundApiError {
  @ApiErrorCode('role_not_found')
  code = 'role_not_found'

  meta: never

  constructor (roleUuid?: RoleUuid) {
    super(`Role ${roleUuid ?? ''} not found`)
  }
}
