import path from 'path'
import { kebabCase, pascalCase } from 'change-case'
import { Builder } from '#src/builder/builder.js'
import { CronjobOptions } from '#src/type.js'
import { ResolvedImport } from '#src/registry/helpers/resolver-registry.js'

export function addCronjobModule (builder: Builder, options: CronjobOptions): ResolvedImport {
  const modulePath = path.join(
    options.dir,
    options.subdir,
    'use-cases',
    `${kebabCase(options.name)}`,
    `${kebabCase(options.name)}.cron-job.module.ts`
  )

  builder.addFile(`${options.name}-cron-job-module`, {
    path: modulePath,
    templateFile: '../templates/cronjob/cron-job-module.hbs',
    data: { name: options.name }
  })

  return {
    name: `${pascalCase(options.name)}CronjobModule`,
    path: modulePath
  }
}
