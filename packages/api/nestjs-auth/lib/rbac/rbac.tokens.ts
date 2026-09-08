import { Inject, type Type } from '@nestjs/common'
import type { Role } from './entity/role.entity.js'

export interface RbacTokens {
  cache: symbol
  create: symbol
  viewIndex: symbol
  viewDetail: symbol
  update: symbol
  delete: symbol
  updatePermissions: symbol
  clearCache: symbol
}

const registrations = new WeakMap<object, RbacTokens>()

export function getRbacTokens (role: Type<Role<string>>): RbacTokens {
  const existing = registrations.get(role)
  if (existing !== undefined) return existing

  const prefix = `@wisemen/nestjs-auth/rbac/${role.name}`
  const tokens: RbacTokens = {
    cache: Symbol(`${prefix}/cache`),
    create: Symbol(`${prefix}/create`),
    viewIndex: Symbol(`${prefix}/view-index`),
    viewDetail: Symbol(`${prefix}/view-detail`),
    update: Symbol(`${prefix}/update`),
    delete: Symbol(`${prefix}/delete`),
    updatePermissions: Symbol(`${prefix}/update-permissions`),
    clearCache: Symbol(`${prefix}/clear-cache`)
  }

  registrations.set(role, tokens)
  return tokens
}

export function getRolePermissionsCacheToken (role: Type<Role<string>>): symbol {
  return getRbacTokens(role).cache
}

/**
 * Injects the permission cache belonging to a concrete registered role entity.
 * Use the same entity class that was supplied to `RbacModule.register`.
 */
export function InjectRolePermissionsCache (role: Type<Role<string>>): ParameterDecorator {
  return Inject(getRolePermissionsCacheToken(role))
}
