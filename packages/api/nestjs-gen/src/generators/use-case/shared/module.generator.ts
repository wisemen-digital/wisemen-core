import path from 'path'
import { kebabCase } from 'change-case'
import { importForModuleProperty } from '#src/manipulators/module-import.js'
import { Builder } from '#src/builder/builder.js'
import { GeneratorOptions } from '#src/type.js'

export function addUseCaseModule (
  builder: Builder,
  { dir, subdir, module }: GeneratorOptions,
  useCaseName: string
): void {
  const useCaseModulePath = path.join(dir, subdir, `${kebabCase(module)}/use-cases/${kebabCase(useCaseName)}/${kebabCase(useCaseName)}.module.ts`)

  builder.addFile(`${useCaseName}-module`, {
    path: useCaseModulePath,
    templateFile: '../templates/use-case/shared/module.hbs',
    data: {
      moduleClassName: useCaseName
    }
  })

  builder.addManipulation((): string => {
    const modulePath = builder.getPathOrThrow(`${module}-module`)

    importForModuleProperty(modulePath, useCaseModulePath, 'imports')

    return 'Imported use case module'
  })
}
