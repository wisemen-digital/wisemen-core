import type { HandlebarsModuleOptions } from './handlebars.module-options.js'

export const HANDLEBARS_MODULE_OPTIONS = 'wisemen.nestjs-handlebars.module.options'

export function getTemplateRootPath (options: HandlebarsModuleOptions): string {
  return options.templateRootPath ?? defaultTemplateRootPath()
}

function defaultTemplateRootPath (): string {
  return process.cwd() + '/dist/src/modules'
}
