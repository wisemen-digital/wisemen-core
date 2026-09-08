import { applyDecorators, Controller, Get, Inject, Version, type Type } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import type { Role } from '../../entity/role.entity.js'
import type { RbacControllerFactoryOptions } from '../rbac-controller-options.js'
import { createViewRoleIndexResponse } from './view-role-index.response.js'
import { ViewRoleIndexUseCase } from './view-role-index.use-case.js'

export function createViewRoleIndexController<TRole extends Role<TPermission>, TPermission extends string, TResponse> (
  options: RbacControllerFactoryOptions<TRole, TPermission, TResponse>
): Type<unknown> {
  const ResponseClass = createViewRoleIndexResponse(options.response)

  @applyDecorators(...(options.decorators.class ?? []))
  @ApiTags(options.swaggerTag)
  @Controller()
  class ViewRoleIndexController {
    constructor (@Inject(options.tokens.viewIndex) private readonly useCase: ViewRoleIndexUseCase<TRole>) {}

    @Get('roles')
    @Version('1')
    @ApiOkResponse({ type: ResponseClass })
    @applyDecorators(...(options.decorators.read ?? []))
    async getRoles (): Promise<{ items: TResponse[] }> {
      return new ResponseClass((await this.useCase.execute()).map(role => new options.response(role)))
    }
  }

  return ViewRoleIndexController
}
