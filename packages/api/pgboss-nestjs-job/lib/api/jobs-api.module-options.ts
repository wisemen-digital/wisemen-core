import { VERSION_NEUTRAL, type FactoryProvider, type ModuleMetadata } from '@nestjs/common'
import type { DataSource } from 'typeorm'

export type JobsApiVersionValue = string | typeof VERSION_NEUTRAL | Array<string | typeof VERSION_NEUTRAL>

/**
 * Static options that configure a generated job monitoring controller.
 */
export interface JobsApiControllerOptions {
  /**
   * Route path for the generated controller.
   *
   * Defaults to `jobs` for the index endpoint and `jobs/:jobId` for the
   * detail endpoint.
   */
  route?: string

  /**
   * Swagger tag applied to the generated controller.
   *
   * Defaults to `Job`.
   */
  swaggerTag?: string

  /**
   * Nest route version metadata applied to the generated endpoint.
   *
   * Defaults to `1`.
   */
  versioning?: JobsApiVersionValue

  /**
   * Decorators applied to the generated controller class.
   *
   * Use these for application-specific controller metadata, such as guards or
   * permissions.
   */
  classDecorators?: ClassDecorator[]

  /**
   * Decorators applied to the generated `GET` request handler.
   *
   * Use these for application-specific handler metadata, such as guards or
   * permissions.
   */
  handlerDecorators?: MethodDecorator[]

  /**
   * Whether to register the generated controller.
   *
   * Defaults to `true`. Setting this to `false` has the same effect as setting
   * the controller option itself to `false`.
   */
  enabled?: boolean
}

/**
 * Configuration for the generated job monitoring endpoints.
 *
 * Both endpoints are registered with their default options when this object,
 * or one of its properties, is omitted. Set an endpoint to `false` to omit
 * its controller entirely.
 */
export interface JobsApiControllersOptions {
  /**
   * Options for the `GET /jobs` endpoint, or `false` to disable it.
   *
   * Defaults to an enabled controller at `jobs`.
   */
  index?: JobsApiControllerOptions | false

  /**
   * Options for the `GET /jobs/:jobId` endpoint, or `false` to disable it.
   *
   * Defaults to an enabled controller at `jobs/:jobId`.
   */
  detail?: JobsApiControllerOptions | false
}

/**
 * Runtime dependencies used by the job monitoring API.
 */
export interface JobsApiModuleOptions {
  /**
   * TypeORM data source connected to the database containing the `pgboss`
   * schema.
   */
  dataSource: DataSource
}

/**
 * Async registration options for `JobsApiModule.forRootAsync(...)`.
 */
export interface JobsApiModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  /**
   * Nest modules that provide dependencies used by `useFactory`.
   */
  imports?: ModuleMetadata['imports']

  /**
   * Names of the queues exposed by the monitoring endpoints.
   *
   * These names are used to validate request filters and generate Swagger
   * metadata, so they must be known when the module is registered.
   */
  queueNames: readonly string[]

  /**
   * Optional configuration for generated monitoring controllers.
   *
   * When omitted, both the index and detail controllers are registered with
   * their default options. Set an individual controller to `false` to disable
   * it.
   */
  controllers?: JobsApiControllersOptions

  /**
   * Factory that resolves the runtime dependencies for the monitoring API.
   *
   * It must return the TypeORM data source used to query PgBoss jobs.
   */
  useFactory: (...args: unknown[]) => Promise<JobsApiModuleOptions> | JobsApiModuleOptions

  /**
   * Injection tokens passed to `useFactory`.
   *
   * Defaults to an empty array.
   */
  inject?: FactoryProvider['inject']
}

/**
 * Fully resolved controller metadata used internally to create a controller.
 */
export interface ResolvedJobsApiControllerOptions {
  /** Route path applied to the generated controller. */
  route: string
  /** Swagger tag applied to the generated controller. */
  swaggerTag: string
  /** Nest route version metadata applied to the generated endpoint. */
  versioning: JobsApiVersionValue
  /** Decorators applied to the generated controller class. */
  classDecorators?: ClassDecorator[]
  /** Decorators applied to the generated `GET` request handler. */
  handlerDecorators?: MethodDecorator[]
}

export function resolveViewJobsIndexControllerOptions (
  options?: JobsApiControllerOptions | false
): ResolvedJobsApiControllerOptions | undefined {
  if (options === false || options?.enabled === false) {
    return undefined
  }

  return resolveJobsApiControllerOptions(options, 'jobs')
}

export function resolveViewJobDetailControllerOptions (
  options?: JobsApiControllerOptions | false
): ResolvedJobsApiControllerOptions | undefined {
  if (options === false || options?.enabled === false) {
    return undefined
  }

  return resolveJobsApiControllerOptions(options, 'jobs/:jobId')
}

function resolveJobsApiControllerOptions (
  options: JobsApiControllerOptions | undefined,
  route: string
): ResolvedJobsApiControllerOptions {
  return {
    route: options?.route ?? route,
    swaggerTag: options?.swaggerTag ?? 'Job',
    versioning: options?.versioning ?? '1',
    classDecorators: options?.classDecorators,
    handlerDecorators: options?.handlerDecorators
  }
}
