// src: https://github.com/open-telemetry/opentelemetry-js-contrib/blob/main/packages/instrumentation-nestjs-core/src/instrumentation.ts
import {
  InstrumentationBase,
  InstrumentationNodeModuleDefinition,
  InstrumentationNodeModuleFile,
  isWrapped,
  type InstrumentationConfig
} from '@opentelemetry/instrumentation'
import { diag } from '@opentelemetry/api'
import {
  traceAllNestLayers,
  type NestContainers,
  type TraceAllNestLayersOptions
} from './trace-all-nest-layers.js'

const NEST_CORE = '@nestjs/core'
const SUPPORTED_VERSIONS = ['>=8.0.0 <12']
const FACTORY_METHODS = ['create', 'createMicroservice', 'createApplicationContext'] as const

// instrumentation-nestjs-core patches the same methods and is registered first.
// `unwrap` restores the raw method, so unwrapping anything but our own wrapper
// would throw that patch away and lose its "Create Nest App" span.
const PATCHED = Symbol('wisemen.nestFactoryPatched')

function isOwnWrapper (value: unknown): boolean {
  return (value as Record<symbol, unknown> | undefined)?.[PATCHED] === true
}

export interface NestLayerInstrumentationConfig extends InstrumentationConfig {
  /** Which layers to wrap. Defaults to all. */
  layers?: TraceAllNestLayersOptions
}

/**
 * Traces the Nest layers no other instrumentation covers — middleware, guards,
 * interceptors, exception filters, use cases and repositories.
 *
 * Patching `NestFactory` rather than asking applications to call a function
 * keeps this automatic, and means the app's own `@nestjs/core` is the one being
 * read: the containers come off the created app, so no Nest value is ever
 * imported here and no class token can mismatch.
 */
export class NestLayerInstrumentation extends InstrumentationBase<NestLayerInstrumentationConfig> {
  constructor (config: NestLayerInstrumentationConfig = {}) {
    super('@wisemen/opentelemetry/nest-layers', '0.4.0', config)
  }

  init (): InstrumentationNodeModuleDefinition {
    const module = new InstrumentationNodeModuleDefinition(NEST_CORE, SUPPORTED_VERSIONS)

    module.files.push(new InstrumentationNodeModuleFile(
      '@nestjs/core/nest-factory.js',
      SUPPORTED_VERSIONS,
      (exports: Record<string, { prototype: Record<string, unknown> }>) => {
        const prototype = exports.NestFactoryStatic?.prototype

        if (prototype == null) {
          return exports
        }

        for (const method of FACTORY_METHODS) {
          if (typeof prototype[method] !== 'function') {
            continue
          }

          if (isWrapped(prototype[method]) && isOwnWrapper(prototype[method])) {
            this._unwrap(prototype, method)
          }

          this._wrap(prototype, method, this.wrapFactoryMethod())
        }

        return exports
      },
      (exports: Record<string, { prototype: Record<string, unknown> }> | undefined) => {
        const prototype = exports?.NestFactoryStatic?.prototype

        if (prototype == null) {
          return
        }

        for (const method of FACTORY_METHODS) {
          if (isWrapped(prototype[method]) && isOwnWrapper(prototype[method])) {
            this._unwrap(prototype, method)
          }
        }
      }
    ))

    return module
  }

  private wrapFactoryMethod () {
    const traceLayers = (app: unknown): void => {
      this.traceLayers(app)
    }

    return function wrap (original: (...args: unknown[]) => Promise<unknown>) {
      async function traced (this: unknown, ...args: unknown[]): Promise<unknown> {
        const app = await original.apply(this, args)

        traceLayers(app)

        return app
      }

      Object.defineProperty(traced, PATCHED, { value: true })

      return traced
    }
  }

  private traceLayers (app: unknown): void {
    if (!this.isEnabled()) {
      return
    }

    try {
      const containers = readContainers(app)

      if (containers == null) {
        diag.debug('Nest layer instrumentation: no container on the created app; skipping.')

        return
      }

      const traced = traceAllNestLayers(containers, this.getConfig().layers)

      diag.debug(`Nest layer instrumentation: traced ${traced.length} methods.`)
    } catch (error) {
      diag.warn('Nest layer instrumentation failed; the app is unaffected.', error)
    }
  }
}

/** Reads the module and enhancer registries off a created Nest application. */
function readContainers (app: unknown): NestContainers | null {
  const container = (app as { container?: {
    getModules?: () => Map<unknown, never>
    applicationConfig?: NestContainers['config']
  } } | null)?.container

  if (typeof container?.getModules !== 'function') {
    return null
  }

  // `getModules()` is a Map keyed by module token; spreading it would yield
  // entry pairs rather than modules.
  return {
    modules: container.getModules().values() as NestContainers['modules'],
    config: container.applicationConfig
  }
}
