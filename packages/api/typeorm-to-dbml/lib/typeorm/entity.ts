import { ClassDeclaration } from 'ts-morph'
import { toSnakeCase } from '#src/helpers/to-snake-case.js'

export function getEntityName (classDecl: ClassDeclaration): string {
  const entityDecorator = classDecl.getDecorator('Entity')

  if (entityDecorator) {
    const args = entityDecorator.getArguments()

    if (args.length > 0) {
      const arg = args[0]
      const argText = arg.getText()

      if (argText.startsWith('\'') || argText.startsWith('"')) {
        return argText.replace(/['"]/g, '')
      }

      if (argText.startsWith('{')) {
        const nameMatch = argText.match(/name\s*:\s*['"]([^'"]+)['"]/)

        if (nameMatch) {
          return nameMatch[1]
        }
      }
    }
  }

  return toSnakeCase(classDecl.getName() ?? 'UnknownEntity')
}
