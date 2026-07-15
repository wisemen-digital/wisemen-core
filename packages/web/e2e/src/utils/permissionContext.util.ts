/**
 * Global permission context for test execution.
 * This allows tests to dynamically set permissions that will be used by MSW handlers.
 *
 * The generic type `T` allows each app to pass its own permission type.
 * By default it uses `string`, so you can use it without specifying a type:
 *
 * @example
 * ```ts
 * permissionContext.setPermissions(['user.read', 'user.create'])
 * ```
 *
 * Or with a custom type:
 * ```ts
 * const typedContext = new PermissionContext<MyPermissionType>()
 * typedContext.setPermissions(['user.read'])
 * ```
 */
export class PermissionContext<T = string> {
  private permissions: T[] = []

  clearPermissions(): void {
    this.permissions = []
  }

  getPermissions(): T[] {
    return this.permissions
  }

  setPermissions(permissions: T[]): void {
    this.permissions = permissions
  }
}

export const permissionContext = new PermissionContext()
