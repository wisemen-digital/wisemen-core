import { DynamicModule, InjectionToken, Module, ModuleMetadata, OptionalFactoryDependency, Provider } from '@nestjs/common'
import { grpc } from '@permify/permify-node'
import { PermifyContext } from './permify.context.js'
import { PermifyClient } from './permify.client.js'
import { Permify, PermifyDepth } from './permify.js'
import { PgBossJob } from '@wisemen/pgboss-nestjs-job'
import { WritePermifySchemaJob } from './queue/write-permify-schema.job.js'
import { WritePermifyTuplesJob } from './queue/write-permify-tuples.job.js'

export type PermifyOptions = {
  /** 
   * The depth used by the `Permify` class.
   * Must be at least 3.
   * @default 20
   * @see [docs](https://fusionauth.io/permify-docs/api-reference/permission/check-api) 
   */
  checkDepth?: number
  /** The pg-boss queue on which Permify write jobs are dispatched. */
  queueName: string
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
        this.createRegisterQueueNameProvider(),
        PermifyContext,
        Permify
      ],
      exports: [
        PermifyClient,
        PermifyContext,
        Permify
      ]
    }
  }

  private static createRegisterQueueNameProvider (): Provider {
    return {
      provide: 'wisemen.register-permify-queue-name',
      inject: [PERMIFY_CONFIG],
      useFactory: (options: PermifyOptions): true => {
        PgBossJob(options.queueName)(WritePermifySchemaJob)
        PgBossJob(options.queueName)(WritePermifyTuplesJob)

        return true
      }
    }
  }
}
