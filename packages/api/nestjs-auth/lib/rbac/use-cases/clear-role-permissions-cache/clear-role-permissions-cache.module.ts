import type { DynamicModule, Provider } from '@nestjs/common'
import { getRepositoryToken } from '@nestjs/typeorm'
import { DomainEventEmitter } from '@wisemen/nestjs-domain-events'
import { getDataSourceToken, TypeOrmModule, type TypeOrmRepository } from '@wisemen/nestjs-typeorm'
import type { DataSource } from 'typeorm'
import { createRolePermissionsCacheModule } from '../../cache/role-permissions-cache.module.js'
import { RolePermissionsCache } from '../../cache/role-permissions.cache.js'
import type { Role } from '../../entity/role.entity.js'
import { getRbacFeatureModule } from '../../module/rbac-feature-module.js'
import { getRbacTokens } from '../../rbac.tokens.js'
import { isRbacControllerEnabled, type RbacModuleOptions, type RoleAssignment } from '../../rbac.types.js'
import { createRbacControllerOptions } from '../rbac-controller-options.js'
import { createClearRolePermissionsCacheController } from './clear-role-permissions-cache.controller.js'
import { createClearRolePermissionsCacheSubscriber } from './clear-role-permissions-cache.subscriber.js'
import { ClearRolePermissionsCacheUseCase } from './clear-role-permissions-cache.use-case.js'

export function createClearRolePermissionsCacheModule<TRole extends Role<TPermission>, TPermission extends string, TResponse> (
  options: RbacModuleOptions<TRole, TPermission, RoleAssignment<TRole>, TResponse>
): DynamicModule {
  const tokens = getRbacTokens(options.role as never)
  const provider: Provider = {
    provide: tokens.clearCache,
    inject: [getDataSourceToken(), DomainEventEmitter, getRepositoryToken(options.role), tokens.cache],
    useFactory: (
      dataSource: DataSource,
      eventEmitter: DomainEventEmitter,
      roleRepository: TypeOrmRepository<TRole>,
      cache: RolePermissionsCache<TRole>
    ): ClearRolePermissionsCacheUseCase<TRole> =>
      new ClearRolePermissionsCacheUseCase(dataSource, eventEmitter, roleRepository, cache, options.eventSubjectType)
  }

  return {
    module: getRbacFeatureModule(options.role, 'clear-role-permissions-cache'),
    imports: [
      createRolePermissionsCacheModule(options),
      TypeOrmModule.forFeature([options.role])
    ],
    controllers: isRbacControllerEnabled(options.controllers, 'clearCache')
      ? [createClearRolePermissionsCacheController(createRbacControllerOptions(tokens, options))]
      : [],
    providers: [
      provider,
      createClearRolePermissionsCacheSubscriber<TRole>(tokens, options.eventSubjectType)
    ]
  }
}
