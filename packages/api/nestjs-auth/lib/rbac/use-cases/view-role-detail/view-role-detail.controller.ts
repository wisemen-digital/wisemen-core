import { applyDecorators, Controller, Get, Inject, Param, ParseUUIDPipe, Version, type Type } from '@nestjs/common'
import { ApiErrorResponse } from '@wisemen/api-error'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import type { Role } from '../../entity/role.entity.js'
import { RoleNotFoundError } from '../../errors/role-not-found.error.js'
import type { RbacControllerFactoryOptions } from '../rbac-controller-options.js'
import { ViewRoleDetailUseCase } from './view-role-detail.use-case.js'

export function createViewRoleDetailController<TRole extends Role<TPermission>, TPermission extends string, TResponse> (
  options: RbacControllerFactoryOptions<TRole, TPermission, TResponse>
): Type<unknown> {
  @applyDecorators(...(options.decorators.class ?? []))
  @ApiTags(options.swaggerTag)
  @Controller()
  class ViewRoleDetailController {
    constructor (@Inject(options.tokens.viewDetail) private readonly useCase: ViewRoleDetailUseCase<TRole>) {}

    @Get('roles/:role')
    @Version('1')
    @ApiOkResponse({ type: options.response })
    @ApiErrorResponse(RoleNotFoundError)
    @applyDecorators(...(options.decorators.read ?? []))
    async getRole (@Param('role', ParseUUIDPipe) uuid: TRole['uuid']): Promise<TResponse> {
      return new options.response(await this.useCase.execute(uuid))
    }
  }

  return ViewRoleDetailController
}
