import { DynamicModule, FactoryProvider, Module, ModuleMetadata, Provider } from "@nestjs/common"
import { GoFeatureFlagProvider, GoFeatureFlagProviderOptions } from "@openfeature/go-feature-flag-provider"
import { getOpenFeatureClientToken, OpenFeature, OpenFeatureModule } from "@openfeature/nestjs-sdk"
import { FEATURE_FLAG_REGISTRY_TOKEN, FeatureFlagRegistry, FeatureFlagRegistryOptions } from "./feature-flag.registry.js"
import { FeatureFlagContext } from "./feature-flag.context.js"
import { FeatureFlags } from "./feature-flags.js"

const FEATURE_FLAG_MODULE_OPTIONS = "wisemen.nestjs-feature-flag.module.options"

export interface FeatureFlagModuleOptions {
  /**
  * The provider to be set as OpenFeature default provider.
  * @see {@link OpenFeature#setProvider}
  */
  defaultProvider?: GoFeatureFlagProviderOptions,
  /**
   * A glob pattern which points to files containing the definition of feature flags. 
   */
  flagsGlob: string
}

export interface FeatureFlagModuleAsyncOptions extends Pick<ModuleMetadata, "imports"> {
  useFactory: (...args: unknown[]) => Promise<FeatureFlagModuleOptions> | FeatureFlagModuleOptions
  inject?: FactoryProvider["inject"]
}

@Module({})
export class FeatureFlagModule {
  static forRoot(options: FeatureFlagModuleOptions): DynamicModule {
    return this.forRootAsync({
      useFactory: () => options
    })
  }

  static forRootAsync(options: FeatureFlagModuleAsyncOptions): DynamicModule {
    return {
      module: FeatureFlagModule,
      imports: [
        OpenFeatureModule.forRoot({}),
        ...(options.imports ?? [])
      ],
      providers: [
        this.createOptionsProvider(options),
        this.createRegistryOptionsProvider(),
        this.createOpenFeatureClientProvider(),
        FeatureFlagRegistry,
        FeatureFlagContext,
        FeatureFlags
      ],
      exports: [
        FeatureFlagContext,
        FeatureFlags,
        getOpenFeatureClientToken()
      ]
    }
  }

  private static createOptionsProvider(options: FeatureFlagModuleAsyncOptions): Provider {
    return {
      provide: FEATURE_FLAG_MODULE_OPTIONS,
      useFactory: async (...args: unknown[]) => {
        const resolvedOptions = await options.useFactory(...args)

        if (resolvedOptions.defaultProvider !== undefined) {
          OpenFeature.setProvider(new GoFeatureFlagProvider(resolvedOptions.defaultProvider))
        }

        return resolvedOptions
      },
      inject: options.inject ?? []
    }
  }

  private static createRegistryOptionsProvider(): Provider {
    return {
      provide: FEATURE_FLAG_REGISTRY_TOKEN,
      useFactory: (options: FeatureFlagModuleOptions) => ({
        flagsGlob: options.flagsGlob
      } satisfies FeatureFlagRegistryOptions),
      inject: [FEATURE_FLAG_MODULE_OPTIONS]
    }
  }

  private static createOpenFeatureClientProvider(): Provider {
    return {
      provide: getOpenFeatureClientToken(),
      useFactory: (_options: FeatureFlagModuleOptions) => OpenFeature.getClient(),
      inject: [FEATURE_FLAG_MODULE_OPTIONS]
    }
  }
}
