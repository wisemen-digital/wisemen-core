import { applyDecorators, Body, Controller, HttpCode, HttpStatus, Inject, Param, ParseUUIDPipe, Post, Version, type Type } from '@nestjs/common'
import { ApiErrorResponse } from '@wisemen/api-error'
import { ApiNoContentResponse, ApiTags } from '@nestjs/swagger'
import type { Role } from '../../entity/role.entity.js'
import { RoleNotFoundError } from '../../errors/role-not-found.error.js'
import type { RbacControllerFactoryOptions } from '../rbac-controller-options.js'
import { UpdateRoleCommand } from './update-role.command.js'
import { UpdateRoleUseCase } from './update-role.use-case.js'

export function createUpdateRoleController<TRole extends Role<TPermission>, TPermission extends string, TResponse> (
  options: RbacControllerFactoryOptions<TRole, TPermission, TResponse>
): Type<unknown> {
  @applyDecorators(...(options.decorators.class ?? []))
  @ApiTags(options.swaggerTag)
  @Controller()
  class UpdateRoleController {
    constructor (@Inject(options.tokens.update) private readonly useCase: UpdateRoleUseCase<TRole>) {}

    @Post('roles/:role')
    @Version('1')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiNoContentResponse()
    @ApiErrorResponse(RoleNotFoundError)
    @applyDecorators(...(options.decorators.update ?? []))
    async update (@Body() command: UpdateRoleCommand, @Param('role', ParseUUIDPipe) uuid: TRole['uuid']): Promise<void> {
      await this.useCase.execute(uuid, command.name)
    }
  }

  return UpdateRoleController
}
