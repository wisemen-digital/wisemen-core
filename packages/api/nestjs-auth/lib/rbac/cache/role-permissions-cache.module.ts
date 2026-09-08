import type { DynamicModule, Provider } from '@nestjs/common'
import { getRepositoryToken } from '@nestjs/typeorm'
import { RedisClient } from '@wisemen/nestjs-redis'
import { TypeOrmModule, type TypeOrmRepository } from '@wisemen/nestjs-typeorm'
import type { Role } from '../entity/role.entity.js'
import { getRbacFeatureModule } from '../module/rbac-feature-module.js'
import { getRbacTokens } from '../rbac.tokens.js'
import type { RbacModuleOptions, RoleAssignment } from '../rbac.types.js'
import { RolePermissionsCache } from './role-permissions.cache.js'

export function createRolePermissionsCacheModule<TRole extends Role<TPermission>, TPermission extends string, TResponse> (
  options: RbacModuleOptions<TRole, TPermission, RoleAssignment<TRole>, TResponse>
): DynamicModule {
  const tokens = getRbacTokens(options.role as never)
  const roleRepositoryToken = getRepositoryToken(options.role)
  const cacheProvider: Provider = {
    provide: tokens.cache,
    inject: [RedisClient, roleRepositoryToken],
    useFactory: (
      redisClient: RedisClient,
      roleRepository: TypeOrmRepository<TRole>
    ): RolePermissionsCache<TRole> =>
      new RolePermissionsCache(redisClient, roleRepository, `rbac.${options.role.name}`)
  }

  return {
    module: getRbacFeatureModule(options.role, 'role-permissions-cache'),
    imports: [
      ...(options.imports ?? []),
      TypeOrmModule.forFeature([options.role])
    ],
    providers: [cacheProvider],
    exports: [tokens.cache]
  }
}
