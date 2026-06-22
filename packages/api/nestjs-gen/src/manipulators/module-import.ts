import ts from 'typescript'
import { Node, SyntaxKind } from 'ts-morph'
import { importModuleFromFile } from './helpers/import-module.js'
import { manipulateFile } from './helpers/manipulate-file.js'

export function importForModuleProperty (
  targetPath: string,
  sourcePath: string,
  propertyName: string
): void {
  manipulateFile(targetPath, (targetFile, project) => {
    const sourceClassName = importModuleFromFile(
      project,
      targetFile,
      sourcePath
    )

    const moduleClass = targetFile.getClassOrThrow(() => true)
    const moduleDecorator = moduleClass.getDecoratorOrThrow('Module')
    const moduleArguments = moduleDecorator.getArguments()

    if (
      moduleArguments.length === 0
      || !Node.isObjectLiteralExpression(moduleArguments[0])
    ) {
      throw new Error('Module decorator has no arguments')
    }

    const moduleArgument = moduleArguments[0]
    const property = moduleArgument.getProperty(propertyName)

    if (property == null) {
      moduleArgument.addPropertyAssignment({
        name: propertyName,
        initializer: ts.factory.createArrayLiteralExpression([
          ts.factory.createIdentifier(sourceClassName)
        ]).getText()
      })
    } else if (Node.isPropertyAssignment(property)) {
      const array = property
        .getInitializerIfKindOrThrow(SyntaxKind.ArrayLiteralExpression)

      array.addElement(sourceClassName)
    } else {
      throw new Error('Module property is not a PropertyAssignment')
    }
  })
}

export function importForDynamicModuleProperty (
  targetPath: string,
  sourcePath: string,
  propertyName: string
): void {
  manipulateFile(targetPath, (targetFile, project) => {
    const sourceClassName = importModuleFromFile(
      project,
      targetFile,
      sourcePath
    )

    const moduleClass = targetFile.getClassOrThrow(() => true)
    const forRootMethod = moduleClass.getStaticMethod('forRoot')

    if (!forRootMethod) {
      throw new Error('No static forRoot method found on module class')
    }

    const statements = forRootMethod.getStatements()
    const returnStmt = statements.find(s => Node.isReturnStatement(s))

    if (!returnStmt || !Node.isReturnStatement(returnStmt)) {
      throw new Error('No return statement found in forRoot method')
    }

    const objLiteral = returnStmt.getExpressionIfKindOrThrow(SyntaxKind.ObjectLiteralExpression)
    const property = objLiteral.getProperty(propertyName)

    if (!property) {
      objLiteral.addPropertyAssignment({
        name: propertyName,
        initializer: ts.factory.createArrayLiteralExpression([
          ts.factory.createIdentifier(sourceClassName)
        ]).getText()
      })
    } else if (Node.isPropertyAssignment(property)) {
      const array = property
        .getInitializerIfKindOrThrow(SyntaxKind.ArrayLiteralExpression)

      array.addElement(sourceClassName)
    } else {
      throw new Error(`${propertyName} property is not a PropertyAssignment`)
    }
  })
}
