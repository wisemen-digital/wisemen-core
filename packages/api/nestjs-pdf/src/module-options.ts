import type { ModuleMetadata } from '@nestjs/common'

import type { PdfModuleOptions } from './types.js'

export const PDF_MODULE_OPTIONS = Symbol('PDF_MODULE_OPTIONS')
export const PDF_RENDERER = Symbol('PDF_RENDERER')

export interface PdfModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  inject?: Array<string | symbol | Function>
  useFactory: (...args: unknown[]) => Promise<PdfModuleOptions> | PdfModuleOptions
}
