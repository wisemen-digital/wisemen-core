import type { Type } from '@nestjs/common'
import type { Role } from '../entity/role.entity.js'
import type { PermissionEnum, RbacControllerDecorators, RoleResponse } from '../rbac.types.js'
import type { RbacTokens } from '../rbac.tokens.js'

export interface RbacControllerFactoryOptions<TRole extends Role<TPermission>, TPermission extends string, TResponse> {
  tokens: RbacTokens
  permissions: PermissionEnum<TPermission>
  permissionEnumName: string
  response: RoleResponse<TRole, TResponse>
  decorators: RbacControllerDecorators
  swaggerTag: string
}

export function createRbacControllerOptions<TRole extends Role<TPermission>, TPermission extends string, TResponse> (
  tokens: RbacTokens,
  options: {
    permissions: PermissionEnum<TPermission>
    permissionEnumName?: string
    response: RoleResponse<TRole, TResponse>
    decorators?: RbacControllerDecorators
    swaggerTag?: string
    role: Type<TRole>
  }
): RbacControllerFactoryOptions<TRole, TPermission, TResponse> {
  return {
    tokens,
    permissions: options.permissions,
    permissionEnumName: options.permissionEnumName ?? `${options.role.name}Permission`,
    response: options.response,
    decorators: options.decorators ?? {},
    swaggerTag: options.swaggerTag ?? 'Role'
  }
}
