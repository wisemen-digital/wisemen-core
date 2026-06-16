import { PropertyDeclaration, PropertySignature, SourceFile } from 'ts-morph'
import { importModule } from './import-module.js'
import { getModuleSpecifier } from './get-module-specifier.js'

export function importProperty (
  file: SourceFile, property: PropertyDeclaration | PropertySignature
) {
  const moduleSpecifier = getModuleSpecifier(property, file.getFilePath())

  if (moduleSpecifier == null) {
    return
  }

  const type = property.getType().getNonNullableType()

  if (type.isArray()) {
    const elementType = type.getArrayElementTypeOrThrow()
    const typeSymbol = elementType.getSymbol() ?? elementType.getAliasSymbol()

    if (typeSymbol == null) {
      return
    }

    const typeName = typeSymbol.getName() ?? elementType.getText()

    importModule(file, moduleSpecifier, typeName)
  } else {
    const typeSymbol = type.getSymbol() ?? type.getAliasSymbol()
    const typeName = typeSymbol ? typeSymbol.getName() : type.getText()

    importModule(file, moduleSpecifier, typeName)
  }
}
