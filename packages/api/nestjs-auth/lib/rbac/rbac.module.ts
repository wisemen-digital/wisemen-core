import { DynamicModule, Module, type Type } from '@nestjs/common'
import type { Role } from './entity/role.entity.js'
import { createRolePermissionsCacheModule } from './cache/role-permissions-cache.module.js'
import { getRbacTokens } from './rbac.tokens.js'
import type { RbacModuleOptions, RoleAssignment } from './rbac.types.js'
import { createClearRolePermissionsCacheModule } from './use-cases/clear-role-permissions-cache/clear-role-permissions-cache.module.js'
import { createCreateRoleModule } from './use-cases/create-role/create-role.module.js'
import { createDeleteRoleModule } from './use-cases/delete-role/delete-role.module.js'
import { createUpdateRoleModule } from './use-cases/update-role/update-role.module.js'
import { createUpdateRolesPermissionsModule } from './use-cases/update-roles-permissions/update-roles-permissions.module.js'
import { createViewRoleDetailModule } from './use-cases/view-role-detail/view-role-detail.module.js'
import { createViewRoleIndexModule } from './use-cases/view-role-index/view-role-index.module.js'

const modules = new WeakMap<object, Type<unknown>>()

@Module({})
export class RbacModule {
  /**
   * Registers an RBAC HTTP feature for one concrete role entity.
   *
   * The generated module owns entity-specific TypeORM repository providers,
   * controllers, events, and Redis cache tokens. Calling this method for
   * different entity classes is supported; each registration is isolated by
   * its role entity's runtime name.
   */
  static register<
    TPermission extends string,
    TRole extends Role<TPermission>,
    TRoleAssignment extends RoleAssignment<TRole>,
    TResponse
  > (options: RbacModuleOptions<TRole, TPermission, TRoleAssignment, TResponse>): DynamicModule {
    const tokens = getRbacTokens(options.role as never)

    return {
      module: getRegisteredModule(options.role),
      imports: [
        createRolePermissionsCacheModule(options),
        createCreateRoleModule(options),
        createViewRoleIndexModule(options),
        createViewRoleDetailModule(options),
        createUpdateRoleModule(options),
        createDeleteRoleModule(options),
        createUpdateRolesPermissionsModule(options),
        createClearRolePermissionsCacheModule(options)
      ],
      exports: [tokens.cache]
    }
  }
}

function getRegisteredModule (role: Type<unknown>): Type<unknown> {
  const existing = modules.get(role)
  if (existing !== undefined) return existing

  @Module({})
  class RegisteredRbacModule {}

  Object.defineProperty(RegisteredRbacModule, 'name', {
    value: `${role.name}RbacModule`
  })
  modules.set(role, RegisteredRbacModule)
  return RegisteredRbacModule
}
