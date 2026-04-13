import { DynamicModule, Module, Provider, Type } from '@nestjs/common'
import { S3Config } from './providers/s3/s3.config.js'
import { AzureBlobStorageConfig } from './providers/azure-blob-storage/azure-blob-storage.config.js'
import { FileStorage } from './providers/file-storage-provider.js'
import { fileStorageFactory } from './providers/provider.factory.js'
import { FileStorageProvider } from './providers/provider.enum.js'

export const FILE_STORAGE_OPTIONS = 'FILE_STORAGE_OPTIONS'

export type FileStorageOptions
  = | {
    provider: FileStorageProvider.AWS_S3
    config: S3Config
  }
  | {
    provider: FileStorageProvider.AZURE_BLOB_STORAGE
    config: AzureBlobStorageConfig
  }
  | {
    provider: FileStorageProvider.TEST
  }

export interface FileStorageAsyncOptions {
  imports?: Type<unknown>[]
  useFactory: (...args: unknown[]) => Promise<FileStorageOptions> | FileStorageOptions
  inject?: Type<unknown>[]
}

@Module({})
export class FileStorageModule {
  static forRoot (options: FileStorageOptions): DynamicModule {
    return {
      module: FileStorageModule,
      providers: [
        {
          provide: FILE_STORAGE_OPTIONS,
          useValue: options
        },
        {
          provide: FileStorage,
          useFactory: fileStorageFactory,
          inject: [FILE_STORAGE_OPTIONS]
        }
      ],
      exports: [FileStorage]
    }
  }

  static forRootAsync (options: FileStorageAsyncOptions): DynamicModule {
    const optionsProvider: Provider = {
      provide: FILE_STORAGE_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject || []
    }

    return {
      module: FileStorageModule,
      imports: options.imports || [],
      providers: [
        optionsProvider,
        {
          provide: FileStorage,
          useFactory: fileStorageFactory,
          inject: [FILE_STORAGE_OPTIONS]
        }
      ],
      exports: [FileStorage]
    }
  }
}
