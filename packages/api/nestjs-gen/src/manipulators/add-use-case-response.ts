import { importModuleFromFile } from './helpers/import-module.js'
import { manipulateFile } from './helpers/manipulate-file.js'

export function addUseCaseResponse (
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

    executeMethod.setReturnType(`Promise<${sourceClassName}>`)
  })
}
