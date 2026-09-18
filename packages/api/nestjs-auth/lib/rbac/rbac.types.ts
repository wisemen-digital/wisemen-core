import type { ModuleMetadata, Type } from '@nestjs/common'
import type { Role } from './entity/role.entity.js'

/**
 * The runtime representation of the permission enum accepted by an RBAC
 * registration. Pass the enum object itself, rather than an array of values,
 * so generated commands can validate it and generated Swagger schemas can
 * describe it.
 */
export type PermissionEnum<TPermission extends string> = Readonly<Record<string, TPermission>>

/**
 * Minimal contract for the application-owned entity that assigns a role to
 * another record (normally a user). The generated delete use case removes all
 * assignments for a role before deleting that role.
 *
 * The concrete class must be decorated with `@Entity()` and should index its
 * `roleUuid` column.
 */
export interface RoleAssignment<TRole extends Role<string>> {
  roleUuid: TRole['uuid']
}

/**
 * Application response class used by generated read endpoints.
 *
 * Its constructor receives the registered role entity. Define Swagger and
 * serialization decorators on this class; its instance is returned directly,
 * preserving any fields added by the concrete role entity.
 */
export type RoleResponse<TRole extends Role<string>, TResponse> = Type<TResponse> & (new (role: TRole) => TResponse)

/**
 * Generated RBAC controllers that may be exposed for a registration.
 *
 * Omitted entries default to `true`, preserving the complete role HTTP API.
 */
export interface RbacControllers {
  /** `POST /roles` */
  create?: boolean
  /** `GET /roles` */
  viewIndex?: boolean
  /** `GET /roles/:uuid` */
  viewDetail?: boolean
  /** `POST /roles/:uuid` */
  update?: boolean
  /** `DELETE /roles/:uuid` */
  delete?: boolean
  /** `PATCH /roles` for bulk permission updates */
  updatePermissions?: boolean
  /** `POST /roles/clear-cache` */
  clearCache?: boolean
}

/** Returns whether a generated RBAC controller is enabled by its registration. */
export function isRbacControllerEnabled (
  controllers: RbacControllers | undefined,
  controller: keyof RbacControllers
): boolean {
  return controllers?.[controller] ?? true
}

/**
 * Authorization and framework decorators applied to generated controllers.
 *
 * `class` applies to every generated controller. Operation decorators apply
 * to the respective generated endpoint and may include guards, permissions,
 * interceptors, or Swagger decorators.
 */
export interface RbacControllerDecorators {
  /** Applied to every generated RBAC controller class. */
  class?: ClassDecorator[]
  /** Applied to `POST /roles`. */
  create?: MethodDecorator[]
  /** Applied to `GET /roles` and `GET /roles/:uuid`. */
  read?: MethodDecorator[]
  /** Applied to `POST /roles/:uuid` (rename). */
  update?: MethodDecorator[]
  /** Applied to `DELETE /roles/:uuid`. */
  delete?: MethodDecorator[]
  /** Applied to `PATCH /roles` (bulk permission update). */
  updatePermissions?: MethodDecorator[]
  /** Applied to `POST /roles/clear-cache`. */
  clearCache?: MethodDecorator[]
}

/**
 * Configuration for one concrete role registration.
 *
 * `RbacModule.register` creates controllers, providers, TypeORM repositories,
 * and a Redis cache namespace unique to `role`. Registering a second concrete
 * role entity creates an independent RBAC feature.
 */
export interface RbacModuleOptions<
  TRole extends Role<TPermission>,
  TPermission extends string,
  TRoleAssignment extends RoleAssignment<TRole> = RoleAssignment<TRole>,
  TResponse = object
> extends Pick<ModuleMetadata, 'imports'> {
  /**
   * Supporting modules needed by generated providers. Include the consumer's
   * Redis module here so its `RedisClient` is available to the role cache.
   */
  imports?: ModuleMetadata['imports']
  /** Concrete TypeORM `@Entity()` subclass extending the package `Role`. */
  role: Type<TRole>
  /** Runtime permission enum accepted by generated permission commands. */
  permissions: PermissionEnum<TPermission>
  /** Swagger enum component name. Defaults to `${role.name}Permission`. */
  permissionEnumName?: string
  /**
   * Concrete TypeORM `@Entity()` that contains `roleUuid`. Its rows are
   * deleted before a role is deleted.
   */
  roleAssignment: Type<TRoleAssignment>
  /**
   * Decides whether a role may be deleted or have its permissions changed.
   * For example, `role => !role.isSystemAdmin` protects a system role.
   */
  isEditable: (role: TRole) => boolean
  /**
   * Domain-event subject type emitted for this registration. It separates
   * lifecycle events and cache subscribers when multiple role types coexist.
   */
  eventSubjectType: string
  /** Response class constructed from each role returned by generated routes. */
  response: RoleResponse<TRole, TResponse>
  /**
   * Generated HTTP controllers to expose. All controllers are enabled by
   * default. Set an entry to `false` when the application must not offer that
   * role operation; its use case and lifecycle subscribers remain available
   * to the registration.
   */
  controllers?: RbacControllers
  /**
   * Class- and operation-level controller decorators. Configure decorators
   * only for controllers enabled above, for example endpoint permissions.
   */
  decorators?: RbacControllerDecorators
  /** Swagger tag applied to generated controllers. Defaults to `Role`. */
  swaggerTag?: string
}
