import { applyDecorators, Body, Controller, HttpCode, HttpStatus, Inject, Post, Version, type Type } from '@nestjs/common'
import { ApiNoContentResponse, ApiTags } from '@nestjs/swagger'
import type { Role } from '../../entity/role.entity.js'
import type { RbacControllerFactoryOptions } from '../rbac-controller-options.js'
import { ClearRolePermissionsCacheCommand } from './clear-role-permissions-cache.command.js'
import { ClearRolePermissionsCacheUseCase } from './clear-role-permissions-cache.use-case.js'

export function createClearRolePermissionsCacheController<TRole extends Role<TPermission>, TPermission extends string, TResponse> (
  options: RbacControllerFactoryOptions<TRole, TPermission, TResponse>
): Type<unknown> {
  @applyDecorators(...(options.decorators.class ?? []))
  @ApiTags(options.swaggerTag)
  @Controller()
  class ClearRolePermissionsCacheController {
    constructor (
      @Inject(options.tokens.clearCache)
      private readonly useCase: ClearRolePermissionsCacheUseCase<TRole>
    ) {}

    @Post('roles/clear-cache')
    @Version('1')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiNoContentResponse()
    @applyDecorators(...(options.decorators.clearCache ?? []))
    async clear (@Body() command: ClearRolePermissionsCacheCommand): Promise<void> {
      await this.useCase.execute((command.roleUuids as TRole['uuid'][] | null | undefined) ?? undefined)
    }
  }

  return ClearRolePermissionsCacheController
}
