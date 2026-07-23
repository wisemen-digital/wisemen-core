import fs from 'node:fs/promises'
import path from 'node:path'
import { Inject, Injectable } from '@nestjs/common'
import hbs from 'handlebars'
import { MAIL_MODULE_OPTIONS, getTemplateRootPath } from './mail.module-definitions.js'
import type { MailModuleOptions } from './mail.module-options.js'

@Injectable()
export class HandlebarsRenderer {
  constructor (
    @Inject(MAIL_MODULE_OPTIONS)
    private readonly options: MailModuleOptions
  ) {}

  async render (
    hbsFilePath: string,
    data?: Record<string, unknown>
  ): Promise<string> {
    const templatePath = path.resolve(getTemplateRootPath(this.options), hbsFilePath)
    const template = await fs.readFile(templatePath, 'utf-8')
    const renderTemplate = hbs.compile(template)

    return renderTemplate(data ?? {})
  }
}
