import { applyDecorators, Body, Controller, HttpCode, HttpStatus, Inject, Patch, Version, type Type } from '@nestjs/common'
import { ApiErrorResponse } from '@wisemen/api-error'
import { ApiNoContentResponse, ApiTags } from '@nestjs/swagger'
import type { Role } from '../../entity/role.entity.js'
import { RoleNotFoundError } from '../../errors/role-not-found.error.js'
import type { RbacControllerFactoryOptions } from '../rbac-controller-options.js'
import { createUpdateRolesPermissionsCommand } from './update-roles-permissions.command.js'
import { UpdateRolesPermissionsUseCase } from './update-roles-permissions.use-case.js'

export function createUpdateRolesPermissionsController<TRole extends Role<TPermission>, TPermission extends string, TResponse> (
  options: RbacControllerFactoryOptions<TRole, TPermission, TResponse>
): Type<unknown> {
  const command = createUpdateRolesPermissionsCommand(options.permissions, options.permissionEnumName)

  @applyDecorators(...(options.decorators.class ?? []))
  @ApiTags(options.swaggerTag)
  @Controller()
  class UpdateRolesPermissionsController {
    constructor (
      @Inject(options.tokens.updatePermissions)
      private readonly useCase: UpdateRolesPermissionsUseCase<TRole, TPermission>
    ) {}

    @Patch('roles')
    @Version('1')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiNoContentResponse()
    @ApiErrorResponse(RoleNotFoundError)
    @applyDecorators(...(options.decorators.updatePermissions ?? []))
    async updatePermissions (@Body() input: InstanceType<typeof command>): Promise<void> {
      await this.useCase.execute(input.roles as Array<{ roleUuid: TRole['uuid']; permissions: TPermission[] }>)
    }
  }

  Reflect.defineMetadata('design:paramtypes', [command], UpdateRolesPermissionsController.prototype, 'updatePermissions')
  return UpdateRolesPermissionsController
}
