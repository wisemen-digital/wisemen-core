import { applyDecorators, Controller, Delete, HttpCode, HttpStatus, Inject, Param, ParseUUIDPipe, Version, type Type } from '@nestjs/common'
import { ApiErrorResponse } from '@wisemen/api-error'
import { ApiNoContentResponse, ApiTags } from '@nestjs/swagger'
import type { Role } from '../../entity/role.entity.js'
import { RoleNotFoundError } from '../../errors/role-not-found.error.js'
import type { RbacControllerFactoryOptions } from '../rbac-controller-options.js'
import { DeleteRoleUseCase } from './delete-role.use-case.js'

export function createDeleteRoleController<TRole extends Role<TPermission>, TPermission extends string, TResponse> (
  options: RbacControllerFactoryOptions<TRole, TPermission, TResponse>
): Type<unknown> {
  @applyDecorators(...(options.decorators.class ?? []))
  @ApiTags(options.swaggerTag)
  @Controller()
  class DeleteRoleController {
    constructor (@Inject(options.tokens.delete) private readonly useCase: DeleteRoleUseCase<TRole, never>) {}

    @Delete('roles/:role')
    @Version('1')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiNoContentResponse()
    @ApiErrorResponse(RoleNotFoundError)
    @applyDecorators(...(options.decorators.delete ?? []))
    async delete (@Param('role', ParseUUIDPipe) uuid: TRole['uuid']): Promise<void> {
      await this.useCase.execute(uuid)
    }
  }

  return DeleteRoleController
}
