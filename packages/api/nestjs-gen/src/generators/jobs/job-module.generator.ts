import path from 'path'
import { kebabCase, pascalCase } from 'change-case'
import { Builder } from '#src/builder/builder.js'
import { JobOptions } from '#src/type.js'
import { ResolvedImport } from '#src/registry/helpers/resolver-registry.js'

export function addJobModule (
  builder: Builder,
  options: JobOptions
): ResolvedImport {
  const modulePath = path.join(options.dir, options.subdir, 'use-cases', kebabCase(options.name), `${kebabCase(options.name)}-job.module.ts`)

  builder.addFile(`${kebabCase(options.name)}-job-module`, {
    templateFile: '../templates/job/job-module.hbs',
    path: modulePath,
    data: { name: options.name }
  })

  return {
    name: `${pascalCase(options.name)}JobModule`,
    path: modulePath
  }
}
