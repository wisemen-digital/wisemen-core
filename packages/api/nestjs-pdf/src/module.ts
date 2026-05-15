import {
  type DynamicModule,
  Module,
  OnModuleDestroy,
  Inject,
  Optional,
} from '@nestjs/common'

import {
  PDF_MODULE_OPTIONS,
  PDF_RENDERER,
  type PdfModuleAsyncOptions,
} from './module-options.js'
import { createPdfRenderer } from './factory.js'
import type { PdfRenderer } from './types.js'

@Module({})
export class PdfModule implements OnModuleDestroy {
  constructor (
    @Optional()
    @Inject(PDF_RENDERER)
    private readonly pdfRenderer?: PdfRenderer & { close?: () => Promise<void> }
  ) {}

  static forRootAsync (options: PdfModuleAsyncOptions): DynamicModule {
    return {
      module: PdfModule,
      imports: options.imports,
      providers: [
        {
          provide: PDF_MODULE_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject ?? [],
        },
        {
          provide: PDF_RENDERER,
          useFactory: createPdfRenderer,
          inject: [PDF_MODULE_OPTIONS],
        },
      ],
      exports: [PDF_RENDERER],
    }
  }

  async onModuleDestroy (): Promise<void> {
    await this.pdfRenderer?.close?.()
  }
}
