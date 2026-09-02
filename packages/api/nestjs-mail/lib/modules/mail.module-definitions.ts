import type { MailModuleOptions } from './mail.module-options.js'

export const MAIL_MODULE_OPTIONS = 'wisemen.nestjs-mail.module.options'

export function getTemplateRootPath (options: MailModuleOptions): string {
  return options.templateRootPath ?? defaultTemplateRootPath()
}

function defaultTemplateRootPath (): string {
  return process.cwd() + '/dist/src/modules'
}
