import path from 'path'
import { capitalCase, kebabCase, pascalCase, sentenceCase } from 'change-case'
import { Builder } from '#src/builder/builder.js'
import { EventOptions, GeneratorOptions } from '#src/type.js'
import { TestResolverRegistry } from '#src/registry/test.registry.js'
import { DomainEventResolverRegistry } from '#src/registry/domain-event.registry.js'
import { importModule } from '#src/manipulators/helpers/import-module.js'
import { manipulateFile } from '#src/manipulators/helpers/manipulate-file.js'
import { getRelativePath } from '#src/manipulators/helpers/relative-path.js'
import { resolveEntityImport, resolveUseCaseImport } from '#src/registry/generic.registry.js'
import { ResolvedImport } from '#src/registry/helpers/resolver-registry.js'
import { resolveResourceUuidTypeImport, UtilResolverRegistry } from '#src/registry/util.registry.js'
import { resolveResourceNotFoundErrorImport } from '#src/registry/exceptions.registry.js'

export interface UseCaseUnitTestOptions {
  useCaseName: string
  evenOptions?: EventOptions
  commandBuilderImport?: ResolvedImport
  importNotFoundError?: boolean
  importUuidType?: boolean
}

export function addUseCaseUnitTest (
  builder: Builder,
  { dir, subdir, module }: GeneratorOptions,
  templateFile: string,
  useCaseName: string,
  options: UseCaseUnitTestOptions
): void {
  const unitTestPath = path.join(dir, subdir, `${kebabCase(module)}/use-cases/${kebabCase(useCaseName)}/tests/${kebabCase(useCaseName)}.use-case.unit.test.ts`)

  builder.addFile(`${useCaseName}-unit-test`, {
    path: unitTestPath,
    templateFile: templateFile,
    data: {
      ...options,
      testDescriptionName: `${capitalCase(useCaseName)} unit tests`,
      testCaseNameNotFoundError: `throws an error when the ${kebabCase(module)} does not exist`,
      testCaseNameEmitEvent: options.evenOptions != undefined ? `the use case emits a ${sentenceCase(options.evenOptions.name).toLowerCase()}` : undefined,
      repositoryName: `Repository<${pascalCase(module)}>`,
      commandBuilderName: `${pascalCase(useCaseName)}CommandBuilder`,
      eventName: options.evenOptions?.name,
      entityUuidName: `${pascalCase(module)}Uuid`,
      notFoundErrorName: `${pascalCase(module)}NotFoundError`
    }
  })

  builder.addManipulation((): string => {
    manipulateFile(unitTestPath, (file) => {
      const importUuidType = options.importUuidType ?? false
      const importNotFoundError = options.importNotFoundError ?? false

      const resolvedImports = findImports(
        module,
        useCaseName,
        importUuidType,
        importNotFoundError
      )

      for (const resolvedImport of resolvedImports) {
        const relativePath = getRelativePath(unitTestPath, resolvedImport.path)

        importModule(file, relativePath, resolvedImport.name)
      }

      if (options.evenOptions != undefined) {
        const relativePath = getRelativePath(unitTestPath, options.evenOptions.path)

        importModule(file, relativePath, options.evenOptions.name)
      }

      if (options.commandBuilderImport != null) {
        const relativePath = getRelativePath(unitTestPath, options.commandBuilderImport.path)

        importModule(file, relativePath, options.commandBuilderImport.name)
      }
    })

    return 'Added unit test imports'
  })
}

function findImports (
  moduleName: string,
  useCaseName: string,
  importUuidType: boolean,
  importNotFoundError: boolean
): ResolvedImport[] {
  const resolvedTestImports = TestResolverRegistry.resolveImports(['testBench', 'stubDataSource'])
  const resolvedEventImports = DomainEventResolverRegistry.resolveImports(['domainEventEmitter'])

  const generateUuidImport = UtilResolverRegistry.resolveImport('generateUuid')
  const entityImport = resolveEntityImport(moduleName)
  const useCaseImport = resolveUseCaseImport(useCaseName)

  const resolvedImports = [...resolvedTestImports, ...resolvedEventImports]

  if (importUuidType) {
    const uuidTypeImport = resolveResourceUuidTypeImport(moduleName)

    if (uuidTypeImport != null) {
      resolvedImports.push(uuidTypeImport)
    }

    if (generateUuidImport != null) {
      resolvedImports.push(generateUuidImport)
    }
  }

  if (importNotFoundError) {
    const notFoundErrorImport = resolveResourceNotFoundErrorImport(moduleName)

    if (notFoundErrorImport != null) {
      resolvedImports.push(notFoundErrorImport)
    }
  }

  if (entityImport != null) {
    resolvedImports.push(entityImport)
  }

  if (useCaseImport != null) {
    resolvedImports.push(useCaseImport)
  }

  return resolvedImports
}
