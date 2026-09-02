import path from 'path'
import { kebabCase } from 'change-case'
import { Builder } from '#src/builder/builder.js'
import { GeneratorOptions } from '#src/type.js'

export function addModule (
  builder: Builder,
  { dir, subdir, module }: GeneratorOptions
): void {
  const modulePath = path.join(dir, subdir, `${kebabCase(module)}/${kebabCase(module)}.module.ts`)

  builder.addFile(`${module}-module`, {
    skipIfExists: true,
    path: modulePath,
    templateFile: '../templates/module/module.hbs',
    data: {
      moduleClassName: module
    }
  })
}
