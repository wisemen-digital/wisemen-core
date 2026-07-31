import type { FactoryProvider, ModuleMetadata } from '@nestjs/common'

export interface ServiceOsrmClientOptions {
  /** Selects the live HTTP OSRM client implementation. */
  type: 'service'
  /** Base URL of the OSRM instance, for example `http://localhost:15000`. */
  url: string
  /** OSRM profile used for route and table requests. Defaults to `driving`. */
  profile?: string
  /** Optional timeout in milliseconds for each HTTP request. Defaults to 30_000 */
  timeout?: number
}

export interface MockOsrmClientOptions {
  /** Selects the in-memory test implementation. */
  type: 'mock'
  /** Average speed used to derive mock durations. Defaults to `50`. */
  averageSpeedKph?: number
}

export type OsrmClientOptions = ServiceOsrmClientOptions | MockOsrmClientOptions

export interface OsrmModuleOptions {
  /** Concrete OSRM client configuration registered in Nest DI. */
  client: OsrmClientOptions
}

export interface OsrmModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  imports?: ModuleMetadata['imports']
  useFactory: (...args: unknown[]) => Promise<OsrmModuleOptions> | OsrmModuleOptions
  inject?: FactoryProvider['inject']
}

export const OSRM_MODULE_OPTIONS = 'wisemen.nestjs-osrm.module.options'
