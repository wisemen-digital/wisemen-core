import type { DynamicModule, Provider } from '@nestjs/common'
import { getRepositoryToken } from '@nestjs/typeorm'
import { DomainEventEmitter } from '@wisemen/nestjs-domain-events'
import { getDataSourceToken, TypeOrmModule, type TypeOrmRepository } from '@wisemen/nestjs-typeorm'
import type { DataSource } from 'typeorm'
import type { Role } from '../../entity/role.entity.js'
import { getRbacFeatureModule } from '../../module/rbac-feature-module.js'
import { getRbacTokens } from '../../rbac.tokens.js'
import { isRbacControllerEnabled, type RbacModuleOptions, type RoleAssignment } from '../../rbac.types.js'
import { createRbacControllerOptions } from '../rbac-controller-options.js'
import { createUpdateRolesPermissionsController } from './update-roles-permissions.controller.js'
import { UpdateRolesPermissionsUseCase } from './update-roles-permissions.use-case.js'

export function createUpdateRolesPermissionsModule<TRole extends Role<TPermission>, TPermission extends string, TResponse> (
  options: RbacModuleOptions<TRole, TPermission, RoleAssignment<TRole>, TResponse>
): DynamicModule {
  const tokens = getRbacTokens(options.role as never)
  const provider: Provider = {
    provide: tokens.updatePermissions,
    inject: [getDataSourceToken(), DomainEventEmitter, getRepositoryToken(options.role)],
    useFactory: (
      dataSource: DataSource,
      eventEmitter: DomainEventEmitter,
      roleRepository: TypeOrmRepository<TRole>
    ): UpdateRolesPermissionsUseCase<TRole, TPermission> =>
      new UpdateRolesPermissionsUseCase(dataSource, eventEmitter, roleRepository, options.isEditable, options.eventSubjectType)
  }

  return {
    module: getRbacFeatureModule(options.role, 'update-roles-permissions'),
    imports: [TypeOrmModule.forFeature([options.role])],
    controllers: isRbacControllerEnabled(options.controllers, 'updatePermissions')
      ? [createUpdateRolesPermissionsController(createRbacControllerOptions(tokens, options))]
      : [],
    providers: [provider]
  }
}
