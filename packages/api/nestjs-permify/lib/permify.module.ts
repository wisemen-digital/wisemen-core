import { DynamicModule, InjectionToken, Module, ModuleMetadata, OptionalFactoryDependency } from '@nestjs/common'
import { grpc } from '@permify/permify-node'
import { PermifyContext } from './permify.context.js'
import { PermifyClient } from './permify.client.js'
import { Permify, PermifyDepth } from './permify.js'



export type PermifyOptions = {
  /** 
   * The depth used by the `Permify` class.
   * Must be at least 3.
   * @default 20
   * @see [docs](https://fusionauth.io/permify-docs/api-reference/permission/check-api) 
   */
  checkDepth?: number
  client: Parameters<typeof grpc['newClient']>[0]
  & {interceptors: Parameters<typeof grpc['newClient']>[1][]}
}

export interface PermifyModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  inject?: (InjectionToken | OptionalFactoryDependency)[]
  useFactory: (...dependencies: unknown[]) =>  | Promise<PermifyOptions> | PermifyOptions
}

const PERMIFY_CONFIG = Symbol('wisemen.permify-config')

@Module({})
export class PermifyModule {
  static forRootAsync(options: PermifyModuleAsyncOptions): DynamicModule {
    return {
      module: PermifyModule,
      imports: options.imports,
      providers: [
        {
          provide: PERMIFY_CONFIG,
          inject: options.inject,
          useFactory: options.useFactory 
        },
        {
          provide: PermifyClient,
          inject: [PERMIFY_CONFIG],
          useFactory: async (options: PermifyOptions) => {
            return grpc.newClient(options.client, ...options.client.interceptors)
          }
        },
        {
          provide: PermifyDepth,
          inject: [PERMIFY_CONFIG],
          useFactory: async (options: PermifyOptions) => {
            return options.checkDepth ?? 20
          }
        },
        PermifyContext,
        Permify
      ]
    }
  }
}