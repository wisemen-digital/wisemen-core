import { constantCase, kebabCase, pascalCase } from 'change-case'
import { SourceFile, SwitchStatement, SyntaxKind } from 'ts-morph'
import { addCronjobModule } from './cronjob-module.generator.js'
import { addCronjobUseCase } from './cronjob-use-case.generator.js'
import { Builder } from '#src/builder/builder.js'
import { extendEnum } from '#src/manipulators/helpers/extend-enum.js'
import { manipulateFile } from '#src/manipulators/helpers/manipulate-file.js'
import { CronjobResolverRegistry } from '#src/registry/cronjob.registry.js'
import { CronjobOptions } from '#src/type.js'
import { extendSwitchStatement } from '#src/manipulators/helpers/extend-switch-statement.js'
import { ResolvedImport } from '#src/registry/helpers/resolver-registry.js'
import { getRelativePath } from '#src/manipulators/helpers/relative-path.js'
import { importModule } from '#src/manipulators/helpers/import-module.js'

export function addCronJob (builder: Builder, options: CronjobOptions) {
  addCronjobUseCase(builder, options)

  const moduleImport = addCronjobModule(builder, options)

  extendCronjobTypeEnum(builder, options)
  registerCronjobType(builder, options, moduleImport)
}

function extendCronjobTypeEnum (builder: Builder, options: CronjobOptions) {
  const cronjobTypeImport = CronjobResolverRegistry.resolveImport('cronjobType')

  if (cronjobTypeImport === null) {
    return
  }

  builder.addManipulation((): string => {
    manipulateFile(cronjobTypeImport.path, (file) => {
      extendEnum(file, cronjobTypeImport.name, {
        [constantCase(options.name)]: kebabCase(options.name)
      })
    })

    return 'Added cronjob type enum'
  })
}

function registerCronjobType (
  builder: Builder,
  options: CronjobOptions,
  cronjobModuleImport: ResolvedImport
) {
  const factoryImport = CronjobResolverRegistry.resolveImport('cronjobFactory')

  if (factoryImport === null) {
    return
  }

  builder.addManipulation((): string => {
    manipulateFile(factoryImport.path, (file) => {
      const relativePath = getRelativePath(
        factoryImport.path,
        cronjobModuleImport.path
      )

      importModule(file, relativePath, cronjobModuleImport.name)

      const switchStatement = findSwitchStatement(file, factoryImport.name)

      if (switchStatement === null) {
        return
      }

      const newCaseText = `case CronjobType.${constantCase(options.name)}: return ${pascalCase(options.name)}CronjobModule`

      extendSwitchStatement(switchStatement, newCaseText)
    })

    return 'Added cronjob type enum in factory'
  })
}

function findSwitchStatement (file: SourceFile, className: string): SwitchStatement | null {
  const classes = file.getClasses()
  const factoryClass = classes.find(c => c.getName() === className)

  if (factoryClass === undefined) {
    return null
  }

  const createFunction = factoryClass.getStaticMethod('create')

  if (createFunction === undefined) {
    return null
  }

  const statements = createFunction.getDescendantsOfKind(SyntaxKind.SwitchStatement)

  return statements.at(0) ?? null
}
