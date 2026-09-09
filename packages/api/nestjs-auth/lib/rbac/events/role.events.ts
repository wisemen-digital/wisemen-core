import { DomainEvent, RegisterDomainEvent } from '@wisemen/nestjs-domain-events'
import type { Role } from '../entity/role.entity.js'

export class RoleEvent<TRole extends Role<string>, Content extends object> extends DomainEvent<Content> {
  constructor (role: TRole, subjectType: string, content: Content) {
    super({
      content,
      subjectId: role.uuid,
      subjectType
    })
  }
}

export class RoleCreatedEventContent<TRole extends Role<string>> {
  constructor (
    readonly roleUuid: TRole['uuid'],
    readonly roleName: string
  ) {}
}

@RegisterDomainEvent('role.created', 1)
export class RoleCreatedEvent<TRole extends Role<string>> extends RoleEvent<TRole, RoleCreatedEventContent<TRole>> {
  constructor (role: TRole, subjectType: string) {
    super(role, subjectType, new RoleCreatedEventContent(role.uuid, role.name))
  }
}

export class RoleDeletedEventContent<TRole extends Role<string>> {
  constructor (
    readonly roleUuid: TRole['uuid'],
    readonly roleName: string
  ) {}
}

@RegisterDomainEvent('role.deleted', 1)
export class RoleDeletedEvent<TRole extends Role<string>> extends RoleEvent<TRole, RoleDeletedEventContent<TRole>> {
  constructor (role: TRole, subjectType: string) {
    super(role, subjectType, new RoleDeletedEventContent(role.uuid, role.name))
  }
}

export class RoleRenamedEventContent<TRole extends Role<string>> {
  constructor (
    readonly roleUuid: TRole['uuid'],
    readonly previousName: string,
    readonly newName: string
  ) {}
}

@RegisterDomainEvent('role.renamed', 1)
export class RoleRenamedEvent<TRole extends Role<string>> extends RoleEvent<TRole, RoleRenamedEventContent<TRole>> {
  constructor (role: TRole, previousName: string, subjectType: string) {
    super(role, subjectType, new RoleRenamedEventContent(role.uuid, previousName, role.name))
  }
}

export class RolePermissionsUpdatedEventContent<TRole extends Role<string>> {
  constructor (
    readonly roleUuid: TRole['uuid'],
    readonly roleName: string,
    readonly newPermissions: TRole['permissions']
  ) {}
}

@RegisterDomainEvent('role.permissions.updated', 1)
export class RolePermissionsUpdatedEvent<TRole extends Role<string>> extends RoleEvent<TRole, RolePermissionsUpdatedEventContent<TRole>> {
  constructor (role: TRole, subjectType: string) {
    super(role, subjectType, new RolePermissionsUpdatedEventContent(role.uuid, role.name, role.permissions))
  }
}

export class RolePermissionsCacheClearedEventContent {
  constructor (readonly roleUuids: string[]) {}
}

@RegisterDomainEvent('role.permissions.cache.cleared', 1)
export class RolePermissionsCacheClearedEvent extends DomainEvent<RolePermissionsCacheClearedEventContent> {
  constructor (roleUuids: string[], subjectType: string) {
    super({ content: new RolePermissionsCacheClearedEventContent(roleUuids), subjectType })
  }
}
