import { Project, SourceFile } from 'ts-morph'
import { getRelativePath } from './relative-path.js'

export function importModuleFromFile (
  project: Project,
  targetFile: SourceFile,
  sourcePath: string
): string {
  const sourceFile = project.addSourceFileAtPath(sourcePath)
  const sourceClass = sourceFile.getClass(() => true)

  if (sourceClass == null) {
    throw new Error(`Class not found: ${sourcePath}`)
  }

  const sourceClassName = sourceClass.getNameOrThrow()

  const relativePath = getRelativePath(
    targetFile.getFilePath(), sourcePath)

  importModule(targetFile, relativePath, sourceClassName)

  return sourceClassName
}

export function importModule (
  targetFile: SourceFile,
  moduleSpecifier: string,
  nameImport: string
): void {
  const importDeclaration = targetFile.getImportDeclaration(
    decl => decl.getModuleSpecifierValue() === moduleSpecifier
  )

  if (importDeclaration == null) {
    targetFile.addImportDeclaration({
      namedImports: [nameImport],
      moduleSpecifier
    })
  } else if (!importDeclaration.getNamedImports().some(ni => ni.getName() === nameImport)) {
    importDeclaration.addNamedImport(nameImport)
  }
}
