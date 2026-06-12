import path from 'path'
import { constantCase, kebabCase } from 'change-case'
import { Builder } from '#src/builder/builder.js'
import { GeneratorOptions } from '#src/type.js'
import { getRelativePath } from '#src/manipulators/helpers/relative-path.js'
import { importModule } from '#src/manipulators/helpers/import-module.js'
import { manipulateFile } from '#src/manipulators/helpers/manipulate-file.js'
import { TestResolverRegistry } from '#src/registry/test.registry.js'
import { PermissionResolverRegistry } from '#src/registry/permission.registry.js'
import { ResolvedImport } from '#src/registry/helpers/resolver-registry.js'

export interface EndToEndTestOptions {
  routePath: string
  testDescriptionName: string
  testCaseName: string
  permissionName: string
  commandBuilderImport?: ResolvedImport
}

export function addEndToEndTest (
  builder: Builder,
  { dir, subdir, module }: GeneratorOptions,
  templateFile: string,
  useCaseName: string,
  options: EndToEndTestOptions
): void {
  const resolvedImports = TestResolverRegistry.resolveImports(['setup', 'testBench', 'testUser'])
  const permissionImport = PermissionResolverRegistry.resolveImport('permissionEnum')
  const endToEndTestPath = path.join(dir, subdir, `${kebabCase(module)}/use-cases/${kebabCase(useCaseName)}/tests/${kebabCase(useCaseName)}.e2e.test.ts`)

  if (permissionImport != null) {
    resolvedImports.push(permissionImport)
  }

  if (options.commandBuilderImport != undefined) {
    resolvedImports.push(options.commandBuilderImport)
  }

  builder.addFile(`${useCaseName}-e2e-test`, {
    path: endToEndTestPath,
    templateFile: templateFile,
    data: {
      testDescriptionName: options.testDescriptionName,
      testCaseName: options.testCaseName,
      routePath: options.routePath,
      commandBuilderName: options.commandBuilderImport?.name,
      permissionEnumValue: constantCase(options.permissionName)
    }
  })

  builder.addManipulation((): string => {
    manipulateFile(endToEndTestPath, (file) => {
      for (const resolvedImport of resolvedImports) {
        const relativePath = getRelativePath(endToEndTestPath, resolvedImport.path)

        importModule(file, relativePath, resolvedImport.name)
      }
    })

    return 'Added end-to-end test imports'
  })
}
