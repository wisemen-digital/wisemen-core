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
import { createDeleteRoleController } from './delete-role.controller.js'
import { DeleteRoleUseCase } from './delete-role.use-case.js'

export function createDeleteRoleModule<TRole extends Role<TPermission>, TPermission extends string, TRoleAssignment extends RoleAssignment<TRole>, TResponse> (
  options: RbacModuleOptions<TRole, TPermission, TRoleAssignment, TResponse>
): DynamicModule {
  const tokens = getRbacTokens(options.role as never)
  const provider: Provider = {
    provide: tokens.delete,
    inject: [getDataSourceToken(), DomainEventEmitter, getRepositoryToken(options.role), getRepositoryToken(options.roleAssignment)],
    useFactory: (
      dataSource: DataSource,
      eventEmitter: DomainEventEmitter,
      roleRepository: TypeOrmRepository<TRole>,
      roleAssignmentRepository: TypeOrmRepository<TRoleAssignment>
    ): DeleteRoleUseCase<TRole, TRoleAssignment> =>
      new DeleteRoleUseCase(dataSource, eventEmitter, roleRepository, roleAssignmentRepository, options.isEditable, options.eventSubjectType)
  }

  return {
    module: getRbacFeatureModule(options.role, 'delete-role'),
    imports: [TypeOrmModule.forFeature([options.role, options.roleAssignment])],
    controllers: isRbacControllerEnabled(options.controllers, 'delete')
      ? [createDeleteRoleController(createRbacControllerOptions(tokens, options))]
      : [],
    providers: [provider]
  }
}
