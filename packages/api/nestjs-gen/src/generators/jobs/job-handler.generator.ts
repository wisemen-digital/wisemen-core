import path from 'path'
import { kebabCase } from 'change-case'
import { Builder } from '#src/builder/builder.js'
import { ResolvedImport } from '#src/registry/helpers/resolver-registry.js'
import { JobOptions } from '#src/type.js'

export function addJobHandler (builder: Builder, options: JobOptions): ResolvedImport {
  const handlerPath = path.join(options.dir, options.subdir, 'use-cases', kebabCase(options.name), `${kebabCase(options.name)}.handler.ts`)

  builder.addFile(`${kebabCase(options.name)}-job-handler`, {
    templateFile: '../templates/job/job-handler.hbs',
    path: handlerPath,
    data: {
      name: options.name,
      queue: options.queue
    }
  })

  return {
    name: `${kebabCase(options.name)}JobHandler`,
    path: handlerPath
  }
}
