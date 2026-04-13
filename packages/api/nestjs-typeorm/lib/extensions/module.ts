import { DynamicModule } from '@nestjs/common'
import { TypeOrmModule as TM, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm'
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type.js'
import { createConnection, DataSource, DataSourceOptions } from 'typeorm'
import { DEFAULT_DATA_SOURCE_NAME } from '@nestjs/typeorm/dist/typeorm.constants.js'
import { EntitiesMetadataStorage } from '@nestjs/typeorm/dist/entities-metadata.storage.js'
import { ColumnType } from 'typeorm/browser'
import { createTypeOrmProviders } from './create-providers.js'

export interface NestjsTypeOrmModuleAsyncOptions extends TypeOrmModuleAsyncOptions {
  customDataTypes?: string[]
}

export class TypeOrmModule extends TM {
  static forFeature (
    entities: EntityClassOrSchema[] = [],
    dataSource:
      | DataSource
      | DataSourceOptions
      | string = DEFAULT_DATA_SOURCE_NAME
  ): DynamicModule {
    const providers = createTypeOrmProviders(entities, dataSource)

    EntitiesMetadataStorage.addEntitiesByDataSource(dataSource, [...entities])

    return {
      module: TypeOrmModule,
      providers: providers,
      exports: providers
    }
  }

  static forRootAsync (options: NestjsTypeOrmModuleAsyncOptions): DynamicModule {
    options.dataSourceFactory = async (dataSourceOptions: DataSourceOptions) => {
      const source = DataSource === undefined
        ? await createConnection(dataSourceOptions)
        : new DataSource(dataSourceOptions)

      source.driver.supportedDataTypes.push(...(options.customDataTypes ?? []) as ColumnType[])

      return source
    }

    return super.forRootAsync(options)
  }
}
