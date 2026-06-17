import { importModule, importModuleFromFile } from './helpers/import-module.js'
import { addMethodExpressionParam, addMethodParam } from './helpers/add-method-param.js'
import { getPublicMethod } from './helpers/get-method.js'
import { manipulateFile } from './helpers/manipulate-file.js'

export function addControllerCommand (
  targetPath: string,
  sourcePath: string
): void {
  manipulateFile(targetPath, (targetFile, project) => {
    const targetClass = targetFile.getClassOrThrow(() => true)

    importModule(targetFile, '@nestjs/common', 'Body')

    const sourceClassName = importModuleFromFile(
      project,
      targetFile,
      sourcePath
    )

    const controllerMethod = getPublicMethod(targetClass)

    addMethodParam(controllerMethod, {
      paramName: 'command',
      paramType: sourceClassName,
      paramDecorators: [{
        name: 'Body',
        arguments: []
      }]
    })

    addMethodExpressionParam(controllerMethod, 'command')
  })
}
