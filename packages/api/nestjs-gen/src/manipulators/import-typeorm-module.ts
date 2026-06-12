import { Node, SyntaxKind } from 'ts-morph'
import { importModule } from './helpers/import-module.js'
import { manipulateFile } from './helpers/manipulate-file.js'
import { getRelativePath } from './helpers/relative-path.js'

export function addTypeOrmModuleImport (
  targetPath: string,
  entityPaths: string[]
): void {
  manipulateFile(targetPath, (targetFile, project) => {
    importModule(targetFile, '@wisemen/nestjs-typeorm', 'TypeOrmModule')

    const entityNames: string[] = []

    entityPaths.forEach((entityPath) => {
      const entityFile = project.addSourceFileAtPath(entityPath)
      const entityClass = entityFile.getClassOrThrow(() => true)

      entityNames.push(entityClass.getNameOrThrow())

      const entityImportPath = getRelativePath(targetPath, entityPath)

      if (!targetFile.getImportDeclaration(entityImportPath)) {
        targetFile.addImportDeclaration({
          namedImports: [entityClass.getNameOrThrow()],
          moduleSpecifier: entityImportPath
        })
      }
    })

    const moduleClass = targetFile.getClassOrThrow(() => true)
    const moduleDecorator = moduleClass.getDecoratorOrThrow('Module')
    const moduleArguments = moduleDecorator?.getArguments()

    if (
      moduleArguments.length === 0
      || !Node.isObjectLiteralExpression(moduleArguments[0])
    ) {
      throw new Error('Module decorator has no arguments')
    }

    const moduleArgument = moduleArguments[0]
    const importsProperty = moduleArgument.getProperty('imports')

    if (Node.isPropertyAssignment(importsProperty)) {
      const importsArray = importsProperty.getInitializerIfKindOrThrow(
        SyntaxKind.ArrayLiteralExpression
      )

      const importStatement = `TypeOrmModule.forFeature([${entityNames.join(', ')}])`

      const existingImport = importsArray
        .getElements()
        .find(element => element.getText().includes(importStatement))

      if (!existingImport) {
        importsArray.addElement(importStatement)
      }
    }
  })
}
