import { PropertyDeclaration, PropertySignature } from 'ts-morph'
import { getRelativePath } from './relative-path.js'

export function getModuleSpecifier (
  property: PropertyDeclaration | PropertySignature,
  destinationFilePath: string
): string | null {
  let type = property.getType().getNonNullableType()

  if (type.isArray()) {
    type = type.getArrayElementTypeOrThrow().getNonNullableType()
  }

  const typeSymbol = type.getSymbol() ?? type.getAliasSymbol()

  if (!typeSymbol) {
    return null
  }

  const currentSourceFile = property.getSourceFile()
  const declarations = typeSymbol.getDeclarations()

  if (declarations.length === 0) {
    return null
  }

  for (const importDeclaration of currentSourceFile.getImportDeclarations()) {
    const moduleSpecifier = importDeclaration.getModuleSpecifier().getLiteralValue()

    for (const namedImport of importDeclaration.getNamedImports()) {
      if (namedImport.getName() === typeSymbol.getName()) {
        return moduleSpecifier
      }
    }
  }

  const declarationSourceFile = declarations.at(0)?.getSourceFile()

  if (declarationSourceFile == null) {
    return null
  }

  return getRelativePath(destinationFilePath, declarationSourceFile.getFilePath())
}
