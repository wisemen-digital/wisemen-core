import { InterfaceDeclaration, SourceFile } from 'ts-morph'
import { getRelativePath } from './relative-path.js'
import { importModule } from './import-module.js'
import { isCustomSymbol } from './is-custom-symbol.js'
import { importProperty } from './import-property.js'

export function importInterface (file: SourceFile, interfaceDeclaration: InterfaceDeclaration) {
  const path = file.getFilePath()

  const sourceFile = interfaceDeclaration.getSourceFile()
  const relativePath = getRelativePath(path, sourceFile.getFilePath())
  const typeName = interfaceDeclaration.getName()

  importModule(file, relativePath, typeName)
}

export function importInterfaceWithProperties (
  file: SourceFile,
  interfaceDeclaration: InterfaceDeclaration
) {
  const path = file.getFilePath()

  const sourceFile = interfaceDeclaration.getSourceFile()
  const relativePath = getRelativePath(path, sourceFile.getFilePath())
  const typeName = interfaceDeclaration.getName()

  importModule(file, relativePath, typeName)

  const properties = interfaceDeclaration.getProperties()
    .filter(property => isCustomSymbol(property))

  for (const property of properties) {
    importProperty(file, property)
  }
}
