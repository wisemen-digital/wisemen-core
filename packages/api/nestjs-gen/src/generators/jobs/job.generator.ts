import path from 'path'
import { Project } from 'ts-morph'
import { kebabCase } from 'change-case'
import { addJobHandler } from './job-handler.generator.js'
import { addJobModule } from './job-module.generator.js'
import { Builder } from '#src/builder/builder.js'
import { JobResolverRegistry, resolveWorkerModule } from '#src/registry/job.registry.js'
import { JobOptions } from '#src/type.js'
import { ResolvedImport } from '#src/registry/helpers/resolver-registry.js'
import { getRelativePath } from '#src/manipulators/helpers/relative-path.js'
import { manipulateFile } from '#src/manipulators/helpers/manipulate-file.js'
import { importModule } from '#src/manipulators/helpers/import-module.js'
import { importForDynamicModuleProperty } from '#src/manipulators/module-import.js'

export function addJob (builder: Builder, options: JobOptions) {
  addJobHandler(builder, options)

  const jobModuleImport = addJobModule(builder, options)
  const jobPath = path.join(options.dir, options.subdir, 'use-cases', kebabCase(options.name), `${kebabCase(options.name)}.job.ts`)

  builder.addFile(`${kebabCase(options.name)}-job`, {
    templateFile: '../templates/job/job.hbs',
    path: jobPath,
    data: {
      name: options.name,
      queue: options.queue
    }
  })

  registerJobModule(builder, jobModuleImport, options.queue)
  addJobImports(builder, jobPath)
}

function registerJobModule (builder: Builder, moduleImport: ResolvedImport, queue: string) {
  const workerModuleImport = resolveWorkerModule(queue)

  if (workerModuleImport == null) {
    return
  }

  builder.addManipulation(() => {
    manipulateFile(workerModuleImport.path, (file) => {
      const relativePath = getRelativePath(workerModuleImport.path, moduleImport.path)

      importModule(file, relativePath, moduleImport.name)
    })

    importForDynamicModuleProperty(workerModuleImport.path, moduleImport.path, 'imports')

    return `Registering job module ${moduleImport.name} for queue ${queue}`
  })
}

function addJobImports (builder: Builder, path: string) {
  builder.addManipulation(() => {
    const queueName = JobResolverRegistry.resolveImport('queueName')

    if (queueName == null) {
      return 'No queue name import found'
    }

    manipulateFile(path, (file) => {
      const relativePath = getRelativePath(path, queueName.path)

      importModule(file, relativePath, queueName.name)
    })

    return 'Adding job imports'
  })
}

export function getQueueNames (): string[] {
  const queueNameImport = JobResolverRegistry.resolveImport('queueName')

  if (queueNameImport == null) {
    return []
  }

  const project = new Project()
  const sourceFile = project.addSourceFileAtPath(queueNameImport.path)

  const enums = sourceFile.getEnums()

  if (enums.length === 0) {
    return []
  }

  const enumDeclaration = enums[0]
  const enumMembers = enumDeclaration.getMembers()

  return enumMembers.map(member => member.getName())
}
