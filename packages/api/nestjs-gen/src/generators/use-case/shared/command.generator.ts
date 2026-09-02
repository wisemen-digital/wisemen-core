import path from 'path'
import { kebabCase, pascalCase } from 'change-case'
import { Builder } from '#src/builder/builder.js'
import { GeneratorOptions } from '#src/type.js'
import { ResolvedImport } from '#src/registry/helpers/resolver-registry.js'

export function addCommand (
  builder: Builder,
  { dir, subdir, module }: GeneratorOptions,
  useCaseName: string
): ResolvedImport {
  const commandPath = path.join(dir, subdir, `${kebabCase(module)}/use-cases/${kebabCase(useCaseName)}/${kebabCase(useCaseName)}.command.ts`)

  builder.addFile(`${useCaseName}-command`, {
    path: commandPath,
    templateFile: '../templates/use-case/shared/command.hbs',
    data: {
      useCaseName
    }
  })

  return {
    name: `${pascalCase(useCaseName)}Command`,
    path: commandPath
  }
}
