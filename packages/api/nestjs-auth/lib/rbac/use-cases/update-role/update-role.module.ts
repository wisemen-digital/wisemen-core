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
import { createUpdateRoleController } from './update-role.controller.js'
import { UpdateRoleUseCase } from './update-role.use-case.js'

export function createUpdateRoleModule<TRole extends Role<TPermission>, TPermission extends string, TResponse> (
  options: RbacModuleOptions<TRole, TPermission, RoleAssignment<TRole>, TResponse>
): DynamicModule {
  const tokens = getRbacTokens(options.role as never)
  const roleRepositoryToken = getRepositoryToken(options.role)
  const provider: Provider = {
    provide: tokens.update,
    inject: [getDataSourceToken(), DomainEventEmitter, roleRepositoryToken],
    useFactory: (
      dataSource: DataSource,
      eventEmitter: DomainEventEmitter,
      roleRepository: TypeOrmRepository<TRole>
    ): UpdateRoleUseCase<TRole> =>
      new UpdateRoleUseCase(dataSource, eventEmitter, roleRepository, options.eventSubjectType)
  }

  return {
    module: getRbacFeatureModule(options.role, 'update-role'),
    imports: [TypeOrmModule.forFeature([options.role])],
    controllers: isRbacControllerEnabled(options.controllers, 'update')
      ? [createUpdateRoleController(createRbacControllerOptions(tokens, options))]
      : [],
    providers: [provider]
  }
}
