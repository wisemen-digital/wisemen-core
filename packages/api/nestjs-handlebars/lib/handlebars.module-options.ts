import type { FactoryProvider, ModuleMetadata } from '@nestjs/common'

/**
 * Synchronous configuration for `HandlebarsModule.forRoot(...)`.
 */
export interface HandlebarsModuleOptions {
  /**
   * Base path used by `HandlebarsRenderer` to resolve template file paths.
   *
   * Defaults to `<cwd>/dist/src/modules`.
   */
  templateRootPath?: string
}

/**
 * Async configuration for `HandlebarsModule.forRootAsync(...)`.
 */
export interface HandlebarsModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  /**
   * Optional modules that should be imported before resolving the factory.
   */
  imports?: ModuleMetadata['imports']
  /**
   * Factory that resolves the renderer options from config, secrets, or test setup.
   */
  useFactory: (...args: unknown[]) => Promise<HandlebarsModuleOptions> | HandlebarsModuleOptions
  /** Dependencies injected into `useFactory`. */
  inject?: FactoryProvider['inject']
}
