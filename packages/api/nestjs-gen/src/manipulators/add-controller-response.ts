import { addMethodDecorator } from './helpers/add-method-decorator.js'
import { getPublicMethod } from './helpers/get-method.js'
import { importModule, importModuleFromFile } from './helpers/import-module.js'
import { manipulateFile } from './helpers/manipulate-file.js'

export function addControllerResponse (
  targetPath: string,
  sourcePath: string
): void {
  manipulateFile(targetPath, (targetFile, project) => {
    const sourceClassName = importModuleFromFile(
      project,
      targetFile,
      sourcePath
    )

    importModule(targetFile, '@nestjs/swagger', 'ApiOkResponse')

    const controllerClass = targetFile.getClassOrThrow(() => true)
    const controllerMethod = getPublicMethod(controllerClass)

    controllerMethod.setReturnType(`Promise<${sourceClassName}>`)

    addMethodDecorator(
      controllerMethod,
      'ApiOkResponse',
      [`{ type: ${sourceClassName} }`]
    )
  })
}
