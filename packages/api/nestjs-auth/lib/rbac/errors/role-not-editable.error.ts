import { ApiProperty } from '@nestjs/swagger'
import { ApiErrorCode } from '@wisemen/api-error'
import { ApiErrorMeta } from '@wisemen/api-error'
import { BadRequestApiError } from '@wisemen/api-error'
import type { Role } from '../entity/role.entity.js'

export class RoleNotEditableErrorMeta<TRole extends Role<string>> {
  @ApiProperty({
    format: 'uuid',
    required: true,
    description: 'the role uuid which cannot be edited'
  })
  readonly uuid: TRole['uuid']

  @ApiProperty({
    required: true,
    description: 'the role name which cannot be edited',
    example: 'default'
  })
  readonly name: string

  constructor (role: TRole) {
    this.uuid = role.uuid
    this.name = role.name
  }
}

export class RoleNotEditableError<TRole extends Role<string>> extends BadRequestApiError {
  @ApiErrorCode('role_not_editable')
  readonly code = 'role_not_editable'

  @ApiErrorMeta()
  readonly meta: RoleNotEditableErrorMeta<TRole>

  constructor (role: TRole) {
    super(`This role is not editable`)
    this.meta = new RoleNotEditableErrorMeta(role)
  }
}
