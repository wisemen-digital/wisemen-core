import { ClassDeclaration, SourceFile } from 'ts-morph'
import { isCustomSymbol } from './is-custom-symbol.js'
import { getRelativePath } from './relative-path.js'
import { importModule } from './import-module.js'
import { importProperty } from './import-property.js'

export function importClass (file: SourceFile, classDeclaration: ClassDeclaration) {
  const path = file.getFilePath()

  const sourceFile = classDeclaration.getSourceFile()
  const relativePath = getRelativePath(path, sourceFile.getFilePath())
  const typeName = classDeclaration.getNameOrThrow()

  importModule(file, relativePath, typeName)
}

export function importClassWithProperties (
  file: SourceFile,
  classDeclaration: ClassDeclaration
) {
  const path = file.getFilePath()

  const sourceFile = classDeclaration.getSourceFile()
  const relativePath = getRelativePath(path, sourceFile.getFilePath())
  const typeName = classDeclaration.getNameOrThrow()

  importModule(file, relativePath, typeName)

  const properties = classDeclaration.getProperties()
    .filter(property => isCustomSymbol(property))

  for (const property of properties) {
    importProperty(file, property)
  }
}
