import {
  DynamicModule,
  type FactoryProvider,
  Module,
  type ModuleMetadata,
  type Provider
} from '@nestjs/common'
import { PUSH_PROVIDER } from '../provider/push-provider.types.js'
import { FcmPushProvider } from './fcm-push.provider.js'
import {
  FCM_PUSH_MODULE_OPTIONS,
  type FcmPushModuleOptions
} from './fcm-push-module-options.js'
import { FirebaseMessagingGateway } from './firebase-messaging.gateway.js'
import { FirebaseMessagingGatewayPort } from './firebase-messaging.gateway-port.js'

export interface FcmPushModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  inject?: FactoryProvider<FcmPushModuleOptions>['inject']
  useFactory: (...dependencies: never[]) => FcmPushModuleOptions | Promise<FcmPushModuleOptions>
}

const runtimeProviders: Provider[] = [
  FcmPushProvider,
  FirebaseMessagingGateway,
  { provide: FirebaseMessagingGatewayPort, useExisting: FirebaseMessagingGateway },
  { provide: PUSH_PROVIDER, useExisting: FcmPushProvider }
]

@Module({})
export class FcmPushModule {
  public static forRoot (options: FcmPushModuleOptions): DynamicModule {
    return {
      module: FcmPushModule,
      providers: [{ provide: FCM_PUSH_MODULE_OPTIONS, useValue: options }, ...runtimeProviders],
      exports: [PUSH_PROVIDER, FcmPushProvider, FirebaseMessagingGatewayPort]
    }
  }

  public static forRootAsync (options: FcmPushModuleAsyncOptions): DynamicModule {
    return {
      module: FcmPushModule,
      imports: options.imports ?? [],
      providers: [
        {
          provide: FCM_PUSH_MODULE_OPTIONS,
          inject: options.inject ?? [],
          useFactory: options.useFactory
        },
        ...runtimeProviders
      ],
      exports: [PUSH_PROVIDER, FcmPushProvider, FirebaseMessagingGatewayPort]
    }
  }
}
