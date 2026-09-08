import { Inject, Injectable, type Type } from '@nestjs/common'
import { Subscribe } from '@wisemen/nestjs-domain-events'
import type { Role } from '../../entity/role.entity.js'
import { RoleDeletedEvent, RolePermissionsUpdatedEvent } from '../../events/role.events.js'
import type { RbacTokens } from '../../rbac.tokens.js'
import { ClearRolePermissionsCacheUseCase } from './clear-role-permissions-cache.use-case.js'

export function createClearRolePermissionsCacheSubscriber<TRole extends Role<string>> (
  tokens: RbacTokens,
  subjectType: string
): Type<unknown> {
  @Injectable()
  class ClearRolePermissionsCacheSubscriber {
    constructor (
      @Inject(tokens.clearCache)
      private readonly useCase: ClearRolePermissionsCacheUseCase<TRole>
    ) {}

    @Subscribe(RoleDeletedEvent)
    @Subscribe(RolePermissionsUpdatedEvent)
    async onEvents (events: Array<RoleDeletedEvent<TRole> | RolePermissionsUpdatedEvent<TRole>>): Promise<void> {
      const roleUuids = events
        .filter(event => event.subjectType === subjectType)
        .map(event => event.content.roleUuid)

      if (roleUuids.length > 0) {
        await this.useCase.execute(roleUuids)
      }
    }
  }

  return ClearRolePermissionsCacheSubscriber
}
