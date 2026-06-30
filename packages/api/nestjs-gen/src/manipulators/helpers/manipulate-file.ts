import { IndentationText, Project, QuoteKind, SourceFile } from 'ts-morph'
import { IndentStyle, SemicolonPreference } from 'typescript'

export function manipulateFile (
  targetPath: string,
  callback: (targetFile: SourceFile, project: Project) => void
): void {
  const project = createProject()

  const targetFile = project.addSourceFileAtPath(targetPath)

  callback(targetFile, project)

  saveFile(targetFile)
}

export function createProject (): Project {
  return new Project({
    compilerOptions: {
      strictNullChecks: true
    },
    manipulationSettings: {
      quoteKind: QuoteKind.Single,
      indentationText: IndentationText.TwoSpaces,
      useTrailingCommas: false
    }
  })
}

export function saveFile (
  sourceFile: SourceFile
): void {
  sourceFile.formatText({
    indentSize: 2,
    indentStyle: IndentStyle.Smart,
    convertTabsToSpaces: true,
    semicolons: SemicolonPreference.Remove,
    insertSpaceBeforeFunctionParenthesis: true,
    insertSpaceAfterConstructor: true
  })

  sourceFile.saveSync()
}
