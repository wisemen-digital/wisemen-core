import { insertMethodDecorator } from './helpers/add-method-decorator.js'
import { getPublicMethod } from './helpers/get-method.js'
import { importModule } from './helpers/import-module.js'
import { manipulateFile } from './helpers/manipulate-file.js'

export function addControllerHttpMethod (
  targetPath: string,
  method: 'Get' | 'Post' | 'Put' | 'Delete',
  path: string = ''
): void {
  manipulateFile(targetPath, (targetFile) => {
    importModule(targetFile, '@nestjs/common', method)

    const controllerClass = targetFile.getClassOrThrow(() => true)
    const controllerMethod = getPublicMethod(controllerClass)

    insertMethodDecorator(controllerMethod, 0, method, [`'${path}'`])
  })
}
