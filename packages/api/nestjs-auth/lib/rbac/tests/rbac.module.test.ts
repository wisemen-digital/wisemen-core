import { describe, it } from 'node:test'
import { Column, Entity } from 'typeorm'
import { expect } from 'expect'
import type { DynamicModule, FactoryProvider, Provider, Type } from '@nestjs/common'
import type { RedisClient } from '@wisemen/nestjs-redis'
import { RbacModule } from '../rbac.module.js'
import { Role } from '../entity/role.entity.js'
import { RolePermissionsCache } from '../cache/role-permissions.cache.js'
import { getRbacTokens } from '../rbac.tokens.js'
import { RoleCreatedEvent } from '../events/role.events.js'
import { createClearRolePermissionsCacheSubscriber } from '../use-cases/clear-role-permissions-cache/clear-role-permissions-cache.subscriber.js'
import { DeleteRoleUseCase } from '../use-cases/delete-role/delete-role.use-case.js'
import { RoleNotEditableError } from '../errors/role-not-editable.error.js'
import type { RoleAssignment } from '../rbac.types.js'

enum WorkspacePermission {
  READ = 'workspace.read'
}

enum PortalPermission {
  READ = 'portal.read'
}

@Entity()
class WorkspaceRole extends Role<WorkspacePermission> {
  @Column({ type: 'boolean', default: false })
  isSystemAdmin: boolean
}

@Entity()
class PortalRole extends Role<PortalPermission> {
  @Column({ type: 'boolean', default: false })
  isSystemAdmin: boolean
}

@Entity()
class WorkspaceRoleAssignment implements RoleAssignment<WorkspaceRole> {
  @Column({ type: 'uuid', primary: true })
  roleUuid: WorkspaceRole['uuid']
}

@Entity()
class PortalRoleAssignment implements RoleAssignment<PortalRole> {
  @Column({ type: 'uuid', primary: true })
  roleUuid: PortalRole['uuid']
}

class WorkspaceRoleResponse {
  readonly isSystemAdmin: boolean

  constructor (role: WorkspaceRole) {
    this.isSystemAdmin = role.isSystemAdmin
  }
}

class PortalRoleResponse {
  readonly isSystemAdmin: boolean

  constructor (role: PortalRole) {
    this.isSystemAdmin = role.isSystemAdmin
  }
}

describe('RbacModule', () => {
  it('isolates module classes, providers, and cache namespaces per registered role entity', async () => {
    const workspaceModule = RbacModule.register({
      role: WorkspaceRole,
      permissions: WorkspacePermission,
      roleAssignment: WorkspaceRoleAssignment,
      isEditable: role => !role.isSystemAdmin,
      eventSubjectType: 'workspace_role',
      response: WorkspaceRoleResponse,
      decorators: decorators()
    })
    const portalModule = RbacModule.register({
      role: PortalRole,
      permissions: PortalPermission,
      roleAssignment: PortalRoleAssignment,
      isEditable: role => !role.isSystemAdmin,
      eventSubjectType: 'portal_role',
      response: PortalRoleResponse,
      decorators: decorators()
    })

    expect(workspaceModule.module).not.toBe(portalModule.module)
    expect(workspaceModule.module.name).toBe('WorkspaceRoleRbacModule')
    expect(portalModule.module.name).toBe('PortalRoleRbacModule')
    expect(workspaceModule.imports).toHaveLength(8)
    expect(portalModule.imports).toHaveLength(8)
    expect((workspaceModule.imports as DynamicModule[]).flatMap(module => module.controllers ?? [])).toHaveLength(7)
    expect((portalModule.imports as DynamicModule[]).flatMap(module => module.controllers ?? [])).toHaveLength(7)

    const workspaceTokens = getRbacTokens(WorkspaceRole)
    const portalTokens = getRbacTokens(PortalRole)
    expect(workspaceTokens.cache).not.toBe(portalTokens.cache)

    const cacheModule = workspaceModule.imports?.[0] as DynamicModule
    const cacheProvider = findProvider(cacheModule.providers, workspaceTokens.cache)
    const deletedKeys: string[][] = []
    const cache = cacheProvider.useFactory({
      deleteCachedValues: (keys: string[]) => Promise.resolve().then(() => { deletedKeys.push(keys) })
    } as RedisClient, {}) as RolePermissionsCache<WorkspaceRole>
    await cache.clear(['role-1'] as WorkspaceRole['uuid'][])
    expect(deletedKeys).toEqual([['rbac.WorkspaceRole.role-1']])
  })

  it('uses the registered event subject type and ignores foreign role events in the cache subscriber', async () => {
    const role = new WorkspaceRole()
    role.uuid = 'role-1' as WorkspaceRole['uuid']
    role.name = 'administrator'
    role.permissions = []

    const localEvent = new RoleCreatedEvent(role, 'workspace_role')
    expect(localEvent.type).toBe('role.created')
    expect(localEvent.subjectId).toBe(role.uuid)
    expect(localEvent.subjectType).toBe('workspace_role')

    const cleared: WorkspaceRole['uuid'][][] = []
    const Subscriber = createClearRolePermissionsCacheSubscriber<WorkspaceRole>(
      getRbacTokens(WorkspaceRole),
      'workspace_role'
    ) as unknown as Type<{ onEvents: (events: RoleCreatedEvent<WorkspaceRole>[]) => Promise<void> }>
    const subscriber = new Subscriber({
      execute: (roleUuids: WorkspaceRole['uuid'][]) => Promise.resolve().then(() => { cleared.push(roleUuids) })
    })

    const foreignEvent = new RoleCreatedEvent(role, 'portal_role')
    await subscriber.onEvents([localEvent, foreignEvent])
    expect(cleared).toEqual([[role.uuid]])
  })

  it('omits only the controllers disabled by the registration', () => {
    const module = RbacModule.register({
      role: WorkspaceRole,
      permissions: WorkspacePermission,
      roleAssignment: WorkspaceRoleAssignment,
      isEditable: role => !role.isSystemAdmin,
      eventSubjectType: 'workspace_role',
      response: WorkspaceRoleResponse,
      controllers: {
        create: false,
        clearCache: false
      }
    })

    expect((module.imports as DynamicModule[]).flatMap(item => item.controllers ?? [])).toHaveLength(5)
  })

  it('deletes registered role assignments and rejects roles the registration marks non-editable', async () => {
    const role = new WorkspaceRole()
    role.uuid = 'role-1' as WorkspaceRole['uuid']
    role.name = 'editor'
    role.permissions = []
    role.isSystemAdmin = false

    const deletedLinks: object[] = []
    const deletedRoles: object[] = []
    const events: unknown[] = []
    const roleRepository = {
      findOneBy: () => Promise.resolve(role),
      delete: (criteria: object) => Promise.resolve().then(() => { deletedRoles.push(criteria) })
    }
    const assignmentRepository = {
      delete: (criteria: object) => Promise.resolve().then(() => { deletedLinks.push(criteria) })
    }
    const useCase = new DeleteRoleUseCase<WorkspaceRole, WorkspaceRoleAssignment>(
      {
        transaction: async (callback: (manager: object) => Promise<void>) => await callback({})
      } as never,
      { emitOne: (event: unknown) => Promise.resolve().then(() => { events.push(event) }) } as never,
      roleRepository as never,
      assignmentRepository as never,
      candidate => !candidate.isSystemAdmin,
      'workspace_role'
    )

    await useCase.execute(role.uuid)
    expect(deletedLinks).toEqual([{ roleUuid: role.uuid }])
    expect(deletedRoles).toEqual([{ uuid: role.uuid }])
    expect(events).toHaveLength(1)

    role.isSystemAdmin = true
    await expect(useCase.execute(role.uuid)).rejects.toThrow(RoleNotEditableError)
  })
})

function decorators () {
  return {
    create: [],
    read: [],
    update: [],
    delete: [],
    updatePermissions: [],
    clearCache: []
  }
}

function findProvider (providers: Provider[] | undefined, token: symbol): FactoryProvider {
  const provider = providers?.find(item =>
    typeof item === 'object'
    && item !== null
    && 'provide' in item
    && item.provide === token
  )

  if (provider === undefined || typeof provider !== 'object' || !('useFactory' in provider)) {
    throw new Error('Provider not found')
  }

  return provider
}
