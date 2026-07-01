import { SourceFile, SyntaxKind } from 'ts-morph'
import { importModule } from './helpers/import-module.js'
import { manipulateFile } from './helpers/manipulate-file.js'
import { getRelativePath } from './helpers/relative-path.js'
import { resolveResourceUuidTypeImport } from '#src/registry/util.registry.js'
import { buildEntityUuidType } from '#src/generators/module/entity.generator.js'

export function updateEntityUuidType (
  targetPath: string,
  sourceName: string,
  destinationType: string
): void {
  manipulateFile(targetPath, (file) => {
    const entityUuidImport = resolveResourceUuidTypeImport(destinationType)

    if (entityUuidImport == null) {
      return
    }

    const typeName = buildEntityUuidType(destinationType)
    const path = getRelativePath(targetPath, entityUuidImport.path)

    importModule(file, path, typeName)

    updateParameterToType(file, sourceName, typeName)
    updatePropertyToType(file, sourceName, typeName)
    updateConstructorParameterToType(file, sourceName, typeName)
    updateConstructorUnionObjectParameterType(file, sourceName, typeName)
  })
}

function updateParameterToType (
  file: SourceFile,
  name: string,
  typeName: string
) {
  const methods = file.getClasses().flatMap(cls => cls.getMethods())
  const parameters = methods.flatMap(method => method.getParameters())
  const matchingParameters = parameters.filter(param => param.getName() === name)

  matchingParameters.forEach(param => param.setType(typeName))
}

function updatePropertyToType (
  file: SourceFile,
  name: string,
  typeName: string
) {
  const classes = file.getClasses()
  const properties = classes.flatMap(cls => cls.getProperties())
  const matchingProperties = properties.filter(prop => prop.getName() === name)

  matchingProperties.forEach(prop => prop.setType(typeName))
}

function updateConstructorParameterToType (
  file: SourceFile,
  name: string,
  typeName: string
) {
  const classes = file.getClasses()
  const constructors = classes.flatMap(cls => cls.getConstructors())
  const parameters = constructors.flatMap(constructor => constructor.getParameters())
  const matchingParameters = parameters.filter(param => param.getName() === name)

  matchingParameters.forEach(param => param.setType(typeName))
}

function updateConstructorUnionObjectParameterType (
  file: SourceFile,
  name: string,
  typeName: string
) {
  const classes = file.getClasses()
  const constructors = classes.flatMap(cls => cls.getConstructors())
  const parameters = constructors.flatMap(constructor => constructor.getParameters())

  for (const parameter of parameters) {
    const typeNode = parameter.getTypeNode()

    if (typeNode == null) {
      continue
    }

    if (typeNode.getKind() !== SyntaxKind.TypeReference) {
      continue
    }

    const intersection = typeNode.asKindOrThrow(SyntaxKind.TypeReference)
    const args = intersection.getTypeArguments()
    const matchingArg = args.find(arg => arg.getKind() === SyntaxKind.TypeLiteral)

    if (matchingArg == null) {
      continue
    }

    const typeLiteral = matchingArg.asKindOrThrow(SyntaxKind.TypeLiteral)
    const properties = typeLiteral.getProperties().filter(prop => prop.getName() === name)

    properties.forEach(prop => prop.setType(typeName))
  }
}
