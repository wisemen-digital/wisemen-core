import path from 'path'
import { kebabCase } from 'change-case'
import { Builder } from '#src/builder/builder.js'
import { GeneratorOptions } from '#src/type.js'

export function addPaginationQuery (
  builder: Builder,
  { dir, subdir, module }: GeneratorOptions,
  useCaseName: string
): void {
  const queryPath = path.join(dir, subdir, `${kebabCase(module)}/use-cases/${kebabCase(useCaseName)}/${kebabCase(useCaseName)}.query.ts`)

  builder.addFile(`${useCaseName}-query`, {
    path: queryPath,
    templateFile: '../templates/use-case/shared/query.hbs',
    data: {
      useCaseName
    }
  })
}
