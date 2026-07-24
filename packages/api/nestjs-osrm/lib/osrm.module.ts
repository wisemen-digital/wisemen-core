import { DynamicModule, Module, Provider } from '@nestjs/common'
import { OSRM_MODULE_OPTIONS, type OsrmModuleAsyncOptions, type OsrmModuleOptions } from './osrm.module-options.js'
import { MockOsrmClient } from './osrm-mock.client.js'
import { ServiceOsrmClient } from './osrm-service.client.js'
import { OsrmClient } from './osrm.client.js'

@Module({})
export class OsrmModule {
  static forRoot (options: OsrmModuleOptions): DynamicModule {
    return this.forRootAsync({ useFactory: () => options })
  }

  static forRootAsync (options: OsrmModuleAsyncOptions): DynamicModule {
    return {
      module: OsrmModule,
      imports: options.imports ?? [],
      providers: [
        this.createOptionsProvider(options),
        this.createClientProvider()
      ],
      exports: [OsrmClient]
    }
  }

  private static createOptionsProvider (options: OsrmModuleAsyncOptions): Provider {
    return {
      provide: OSRM_MODULE_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject ?? []
    }
  }

  private static createClientProvider (): Provider {
    return {
      provide: OsrmClient,
      useFactory: (options: OsrmModuleOptions) => {
        switch (options.client.type) {
          case 'mock': return new MockOsrmClient(options.client)
          case 'service': return new ServiceOsrmClient(options.client)
          default: return options.client
        }
      },
      inject: [OSRM_MODULE_OPTIONS]
    }
  }
}
