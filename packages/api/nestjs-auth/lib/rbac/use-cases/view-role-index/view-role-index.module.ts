import type { DynamicModule, Provider } from '@nestjs/common'
import { getRepositoryToken } from '@nestjs/typeorm'
import { TypeOrmModule, type TypeOrmRepository } from '@wisemen/nestjs-typeorm'
import type { Role } from '../../entity/role.entity.js'
import { getRbacFeatureModule } from '../../module/rbac-feature-module.js'
import { getRbacTokens } from '../../rbac.tokens.js'
import { isRbacControllerEnabled, type RbacModuleOptions, type RoleAssignment } from '../../rbac.types.js'
import { createRbacControllerOptions } from '../rbac-controller-options.js'
import { createViewRoleIndexController } from './view-role-index.controller.js'
import { ViewRoleIndexUseCase } from './view-role-index.use-case.js'

export function createViewRoleIndexModule<TRole extends Role<TPermission>, TPermission extends string, TResponse> (
  options: RbacModuleOptions<TRole, TPermission, RoleAssignment<TRole>, TResponse>
): DynamicModule {
  const tokens = getRbacTokens(options.role as never)
  const provider: Provider = {
    provide: tokens.viewIndex,
    inject: [getRepositoryToken(options.role)],
    useFactory: (roleRepository: TypeOrmRepository<TRole>): ViewRoleIndexUseCase<TRole> =>
      new ViewRoleIndexUseCase(roleRepository)
  }

  return {
    module: getRbacFeatureModule(options.role, 'view-role-index'),
    imports: [TypeOrmModule.forFeature([options.role])],
    controllers: isRbacControllerEnabled(options.controllers, 'viewIndex')
      ? [createViewRoleIndexController(createRbacControllerOptions(tokens, options))]
      : [],
    providers: [provider]
  }
}
