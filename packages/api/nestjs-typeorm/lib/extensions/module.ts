import { DynamicModule } from '@nestjs/common'
import { TypeOrmModule as TM, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm'
import { DataSource, DataSourceOptions, EntitySchema } from 'typeorm'
import { ColumnType } from 'typeorm/browser'
import { createTypeOrmProviders } from './create-providers.js'

export interface NestjsTypeOrmModuleAsyncOptions extends TypeOrmModuleAsyncOptions {
  customDataTypes?: string[]
}

export class TypeOrmModule extends TM {
  static forFeature (
    entities: (Function | EntitySchema)[] = [],
    dataSource?: DataSource | DataSourceOptions | string
  ): DynamicModule {
    super.forFeature(entities, dataSource)

    const providers = createTypeOrmProviders(entities, dataSource)

    return {
      module: TypeOrmModule,
      providers: providers,
      exports: providers
    }
  }

  static forRootAsync (options: NestjsTypeOrmModuleAsyncOptions): DynamicModule {
    options.dataSourceFactory = async (dataSourceOptions: DataSourceOptions) => {
      const source =  new DataSource(dataSourceOptions)
      source.driver.supportedDataTypes.push(...(options.customDataTypes ?? []) as ColumnType[])

      await source.initialize()

      return source
    }

    return super.forRootAsync(options)
  }
}
