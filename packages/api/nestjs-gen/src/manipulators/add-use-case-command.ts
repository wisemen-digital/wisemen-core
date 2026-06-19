import { importModuleFromFile } from './helpers/import-module.js'
import { addMethodParam } from './helpers/add-method-param.js'
import { manipulateFile } from './helpers/manipulate-file.js'

export function addUseCaseCommand (
  targetPath: string,
  sourcePath: string
): void {
  manipulateFile(targetPath, (targetFile, project) => {
    const targetClass = targetFile.getClassOrThrow(() => true)

    const sourceClassName = importModuleFromFile(
      project,
      targetFile,
      sourcePath
    )

    const executeMethod = targetClass.getMethodOrThrow('execute')

    addMethodParam(executeMethod, {
      paramName: 'command',
      paramType: sourceClassName
    })
  })
}
