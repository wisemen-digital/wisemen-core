import { applyDecorators, Body, Controller, Inject, Post, Version, type Type } from '@nestjs/common'
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger'
import type { Role } from '../../entity/role.entity.js'
import type { RbacControllerFactoryOptions } from '../rbac-controller-options.js'
import { CreateRoleCommand } from './create-role.command.js'
import { CreateRoleResponse } from './create-role.response.js'
import { CreateRoleUseCase } from './create-role.use-case.js'

export function createCreateRoleController<TRole extends Role<TPermission>, TPermission extends string, TResponse> (
  options: RbacControllerFactoryOptions<TRole, TPermission, TResponse>
): Type<unknown> {
  @applyDecorators(...(options.decorators.class ?? []))
  @ApiTags(options.swaggerTag)
  @Controller()
  class CreateRoleController {
    constructor (@Inject(options.tokens.create) private readonly useCase: CreateRoleUseCase<TRole, TPermission>) {}

    @Post('roles')
    @Version('1')
    @ApiCreatedResponse({ type: CreateRoleResponse })
    @applyDecorators(...(options.decorators.create ?? []))
    async create (@Body() command: CreateRoleCommand): Promise<CreateRoleResponse> {
      return new CreateRoleResponse(await this.useCase.execute(command.name))
    }
  }

  return CreateRoleController
}
