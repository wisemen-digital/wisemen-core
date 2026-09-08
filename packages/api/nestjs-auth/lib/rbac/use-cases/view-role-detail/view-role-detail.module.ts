import type { DynamicModule, Provider } from '@nestjs/common'
import { getRepositoryToken } from '@nestjs/typeorm'
import { TypeOrmModule, type TypeOrmRepository } from '@wisemen/nestjs-typeorm'
import type { Role } from '../../entity/role.entity.js'
import { getRbacFeatureModule } from '../../module/rbac-feature-module.js'
import { getRbacTokens } from '../../rbac.tokens.js'
import { isRbacControllerEnabled, type RbacModuleOptions, type RoleAssignment } from '../../rbac.types.js'
import { createRbacControllerOptions } from '../rbac-controller-options.js'
import { createViewRoleDetailController } from './view-role-detail.controller.js'
import { ViewRoleDetailUseCase } from './view-role-detail.use-case.js'

export function createViewRoleDetailModule<TRole extends Role<TPermission>, TPermission extends string, TResponse> (
  options: RbacModuleOptions<TRole, TPermission, RoleAssignment<TRole>, TResponse>
): DynamicModule {
  const tokens = getRbacTokens(options.role as never)
  const provider: Provider = {
    provide: tokens.viewDetail,
    inject: [getRepositoryToken(options.role)],
    useFactory: (roleRepository: TypeOrmRepository<TRole>): ViewRoleDetailUseCase<TRole> =>
      new ViewRoleDetailUseCase(roleRepository)
  }

  return {
    module: getRbacFeatureModule(options.role, 'view-role-detail'),
    imports: [TypeOrmModule.forFeature([options.role])],
    controllers: isRbacControllerEnabled(options.controllers, 'viewDetail')
      ? [createViewRoleDetailController(createRbacControllerOptions(tokens, options))]
      : [],
    providers: [provider]
  }
}
