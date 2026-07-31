import { VERSION_NEUTRAL, type FactoryProvider, type ModuleMetadata } from '@nestjs/common'

export type ApiStatusVersionValue = string | typeof VERSION_NEUTRAL | Array<string | typeof VERSION_NEUTRAL>

/**
 * Runtime values returned by the API status endpoint.
 */
export interface ApiStatusModuleOptions {
  /**
   * Environment label returned in the response.
   * Example: `development`, `test`, `production`.
   */
  environment: string

  /**
   * Commit SHA of the current build.
   */
  commit: string

  /**
   * Build number or semantic application version.
   */
  version: string

  /**
   * Build timestamp serialized as a string.
   */
  timestamp: string
}

/**
 * Static controller options that influence controller metadata.
 */
export interface ApiStatusControllerOptions {
  /**
   * Optional controller route segment.
   *
   * When omitted, the endpoint is mounted at the module root.
   * Defaults to the base route of the API.
   */
  route?: string

  /**
   * Swagger tag applied to the generated controller.
   *
   * Defaults to `API Status`.
   */
  swaggerTag?: string

  /**
   * Nest route version metadata applied to the endpoint.
   *
   * Defaults to `VERSION_NEUTRAL`.
   */
  versioning?: ApiStatusVersionValue

  /**
   * Whether the generated route should be marked with `@Public(...)`.
   *
   * Defaults to `false`.
   */
  isPublic?: boolean
}

/**
 * Async registration options for `ApiStatusModule.forRootAsync(...)`.
 */
export interface ApiStatusModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  controller?: ApiStatusControllerOptions
  useFactory: (...args: unknown[]) => Promise<ApiStatusModuleOptions> | ApiStatusModuleOptions
  inject?: FactoryProvider['inject']
}

export interface ResolvedApiStatusControllerOptions {
  route?: string
  swaggerTag: string
  versioning: ApiStatusVersionValue
  isPublic: boolean
}

export function resolveApiStatusControllerOptions (
  options: ApiStatusControllerOptions = {}
): ResolvedApiStatusControllerOptions {
  return {
    route: options.route,
    swaggerTag: options.swaggerTag ?? 'API Status',
    versioning: options.versioning ?? VERSION_NEUTRAL,
    isPublic: options.isPublic ?? false
  }
}
