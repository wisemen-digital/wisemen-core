import fs from 'node:fs/promises'
import path from 'node:path'
import { Inject, Injectable } from '@nestjs/common'
import hbs from 'handlebars'
import { HANDLEBARS_MODULE_OPTIONS, getTemplateRootPath } from './handlebars.module-definitions.js'
import type { HandlebarsModuleOptions } from './handlebars.module-options.js'

@Injectable()
export class HandlebarsRenderer {
  constructor (
    @Inject(HANDLEBARS_MODULE_OPTIONS)
    private readonly options: HandlebarsModuleOptions
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
