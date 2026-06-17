import path from 'path'
import { Builder } from '#src/builder/builder.js'
import { importModule } from '#src/manipulators/helpers/import-module.js'
import { manipulateFile } from '#src/manipulators/helpers/manipulate-file.js'
import { getRelativePath } from '#src/manipulators/helpers/relative-path.js'
import { ResolvedImport } from '#src/registry/helpers/resolver-registry.js'

export function addCommandBuilderPlaceholder (
  builder: Builder,
  commandImport: ResolvedImport
): ResolvedImport {
  const commandFileName = path.basename(commandImport.path, '.command.ts')
  const commandBuilderFileName = `${commandFileName}.command.builder.ts`

  const basePath = path.dirname(commandImport.path)
  const commandBuilderPath = path.join(basePath, commandBuilderFileName)

  const command = {
    entityType: commandImport.name,
    properties: []
  }

  builder.addFile(`${commandFileName}-command-builder`, {
    path: commandBuilderPath,
    templateFile: '../templates/builders/command-builder.hbs',
    data: { entities: [command] }
  })

  builder.addManipulation((): string => {
    manipulateFile(commandBuilderPath, (file) => {
      const relativePath = getRelativePath(commandBuilderPath, commandImport.path)

      importModule(file, relativePath, commandImport.name)
    })

    return 'Added command builder placeholder'
  })

  return {
    path: commandBuilderPath,
    name: `${commandImport.name}Builder`
  }
}
