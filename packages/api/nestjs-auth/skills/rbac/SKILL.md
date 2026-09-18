---
name: rbac
description: Use when registering RbacModule from @wisemen/nestjs-auth for an application-owned Role entity, or when writing the permission guard and decorator the application must supply to enforce them.
---

# @wisemen/nestjs-auth - Role-Based Access Control

`RbacModule` manages roles and caches their permissions. Enforcement is the
application's job - see the last section.

## Register Role-Based Access Control

`RbacModule.register(...)` generates the role endpoints, permission cache, and
lifecycle events for one application-owned role entity. Extend the abstract
`Role` and decorate the subclass with `@Entity()`; the base class intentionally
creates no table.

```ts
RbacModule.register({
  imports: [DefaultRedisModule],
  role: WorkspaceRole,
  permissions: Permission,
  roleAssignment: UserRole,
  isEditable: role => !role.isSystemAdmin,
  eventSubjectType: 'role',
  response: WorkspaceRoleResponse,
  decorators: {
    create: [Permissions(Permission.ROLE_CREATE)],
    read: [Permissions(Permission.ROLE_READ)]
  }
})
```

Every generated controller is enabled by default; set a `controllers` entry to
`false` to drop that route.

## Enforce Permissions In The Application

The package does not enforce permissions. Write the guard and the permission
decorator in the application and pass them through `decorators`. There is no
principal-to-role link in the package — that mapping is application data.

A guard reads `BearerAuthContext.getPrincipalOrFail()`, resolves the principal's
role UUIDs, and calls `RolePermissionsCache.get(roleUuids)` — injected with
`@InjectRolePermissionsCache(WorkspaceRole)` — for the union of their
permissions. Handle `principal.type === 'api-key'` explicitly: an API key has no
roles of its own. The cache is cleared automatically when roles change.
