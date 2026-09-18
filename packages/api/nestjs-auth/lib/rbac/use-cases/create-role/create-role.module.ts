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
import { createCreateRoleController } from './create-role.controller.js'
import { CreateRoleUseCase } from './create-role.use-case.js'

export function createCreateRoleModule<TRole extends Role<TPermission>, TPermission extends string, TResponse> (
  options: RbacModuleOptions<TRole, TPermission, RoleAssignment<TRole>, TResponse>
): DynamicModule {
  const tokens = getRbacTokens(options.role as never)
  const roleRepositoryToken = getRepositoryToken(options.role)
  const provider: Provider = {
    provide: tokens.create,
    inject: [getDataSourceToken(), DomainEventEmitter, roleRepositoryToken],
    useFactory: (
      dataSource: DataSource,
      eventEmitter: DomainEventEmitter,
      roleRepository: TypeOrmRepository<TRole>
    ): CreateRoleUseCase<TRole, TPermission> =>
      new CreateRoleUseCase(dataSource, eventEmitter, roleRepository, options.role, options.eventSubjectType)
  }

  return {
    module: getRbacFeatureModule(options.role, 'create-role'),
    imports: [TypeOrmModule.forFeature([options.role])],
    controllers: isRbacControllerEnabled(options.controllers, 'create')
      ? [createCreateRoleController(createRbacControllerOptions(tokens, options))]
      : [],
    providers: [provider]
  }
}
