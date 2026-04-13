import { DynamicModule, Module } from '@nestjs/common'
import { PDF_MODULE_OPTIONS, type PdfModuleAsyncOptions } from './module-options.js'
import { factory } from './factory.js'
import { Api2PdfClient } from './client.js'

@Module({})
export class Api2PdfModule {
  static forRootAsync (options: PdfModuleAsyncOptions): DynamicModule {
    return {
      module: Api2PdfModule,
      imports: options.imports,
      providers: [
        {
          provide: PDF_MODULE_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject ?? []
        },
        {
          provide: Api2PdfClient,
          useFactory: factory,
          inject: [PDF_MODULE_OPTIONS]
        }
      ],
      exports: [Api2PdfClient]
    }
  }
}
