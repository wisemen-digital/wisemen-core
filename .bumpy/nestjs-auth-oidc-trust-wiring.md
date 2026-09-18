---
"@wisemen/nestjs-auth": minor
---

Add bearer authentication and role-based access control.

Bearer authentication covers API keys and both static and dynamic OIDC trusts,
with identity provisioning, Redis-backed authentication caches, and a request
context exposing the authenticated principal.

`RbacModule.register(...)` generates the role HTTP API, role-permission cache,
and lifecycle events for an application-owned role entity. Permission
enforcement stays with the application; the package exposes
`RolePermissionsCache` for guards to read.
