import path from 'path'
import { kebabCase, pascalCase } from 'change-case'
import { Builder } from '#src/builder/builder.js'
import { CronjobOptions } from '#src/type.js'
import { ResolvedImport } from '#src/registry/helpers/resolver-registry.js'

export function addCronjobUseCase (builder: Builder, options: CronjobOptions): ResolvedImport {
  const useCasePath = path.join(
    options.dir,
    options.subdir,
    'use-cases',
    `${kebabCase(options.name)}`,
    `${kebabCase(options.name)}.cron-job.use-case.ts`
  )

  builder.addFile(`${options.name}-cron-job-use-case`, {
    path: useCasePath,
    templateFile: '../templates/cronjob/cron-job-use-case.hbs',
    data: { name: options.name }
  })

  return {
    name: `${pascalCase(options.name)}CronjobUseCase`,
    path: useCasePath
  }
}
