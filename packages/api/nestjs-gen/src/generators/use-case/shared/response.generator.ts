import path from 'path'
import { kebabCase } from 'change-case'
import { Builder } from '#src/builder/builder.js'
import { GeneratorOptions } from '#src/type.js'
import { updateEntityUuidType } from '#src/manipulators/update-entity-uuid-type.js'
import { getRelativePath } from '#src/manipulators/helpers/relative-path.js'

export function addResponse (
  builder: Builder,
  { dir, subdir, module }: GeneratorOptions,
  useCaseName: string
): void {
  const responsePath = path.join(dir, subdir, `${kebabCase(module)}/use-cases/${kebabCase(useCaseName)}/${kebabCase(useCaseName)}.response.ts`)

  const entityPath = builder.getPathOrThrow(`${module}-entity`)
  const entityImportPath = getRelativePath(responsePath, entityPath)

  builder.addFile(`${useCaseName}-response`, {
    path: responsePath,
    templateFile: '../templates/use-case/shared/response.hbs',
    data: {
      useCaseName,
      entityName: module,
      entityImportPath
    }
  })

  builder.addManipulation((): string => {
    updateEntityUuidType(responsePath, 'uuid', module)

    return 'Update uuid type response'
  })
}
