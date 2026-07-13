import { DynamicModule, Module } from '@nestjs/common'
import { TypesenseClient } from './client/typesense.client.js'
import { TypesenseCollections } from './collections/typesense-collections.js'
import { TypesenseCollectorsModule } from './collectors/typesense-collectors.module.js'
import {
  ASYNC_OPTIONS_TYPE,
  ConfigurableModuleClass,
  OPTIONS_TYPE
} from './typesense.module-definitions.js'

@Module({})
export class TypesenseModule extends ConfigurableModuleClass {
  static override forRoot (options: typeof OPTIONS_TYPE): DynamicModule {
    return extendTypesenseModule(super.forRoot(options))
  }

  static override forRootAsync (options: typeof ASYNC_OPTIONS_TYPE): DynamicModule {
    return extendTypesenseModule(super.forRootAsync(options))
  }
}

function extendTypesenseModule (moduleDefinition: DynamicModule): DynamicModule {
  return {
    ...moduleDefinition,
    imports: [
      ...(moduleDefinition.imports ?? []),
      TypesenseCollectorsModule
    ],
    providers: [
      ...(moduleDefinition.providers ?? []),
      TypesenseClient,
      TypesenseCollections
    ],
    exports: [
      ...(moduleDefinition.exports ?? []),
      TypesenseClient,
      TypesenseCollections,
      TypesenseCollectorsModule
    ]
  }
}
