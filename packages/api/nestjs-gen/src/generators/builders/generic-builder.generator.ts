import path, { normalize } from 'path'
import { ClassDeclaration, InterfaceDeclaration, Project } from 'ts-morph'
import { camelCase } from 'change-case'
import { Builder } from '#src/builder/builder.js'
import { sanitizePath } from '#src/manipulators/helpers/sanitize-path.js'
import { createProject, manipulateFile } from '#src/manipulators/helpers/manipulate-file.js'
import { importClassWithProperties } from '#src/manipulators/helpers/import-class.js'
import { importInterfaceWithProperties } from '#src/manipulators/helpers/import-interface.js'
import { extractPropertyMeta, PropertyMeta } from '#src/manipulators/helpers/extract-property-meta.js'
import { ResolvedImport } from '#src/registry/helpers/resolver-registry.js'

type EntityType = ClassDeclaration | InterfaceDeclaration

export enum BuilderType {
  ENTITY = 'entity',
  INTERFACE = 'interface',
  QUERY = 'query',
  COMMAND = 'command'
}

export interface EntityMeta {
  entityName: string
  entityType: string
  isInterface: boolean
  properties: PropertyMeta[]
}

export interface BuilderOptions {
  inputFileSuffix: string
  outputFileSuffix: string
  templateFile: string
}

export function addBuilder (
  builder: Builder,
  inputPath: string,
  outputPath: string,
  options: BuilderOptions,
  transformData?: (entities: EntityMeta) => object
): ResolvedImport {
  if (inputPath.length === 0) {
    throw new Error('Input path cannot be empty')
  }

  const strippedPath = sanitizePath(inputPath)
  const normalizedPath = normalize(strippedPath)

  const { path, name } = generateOutputPathAndName(
    normalizedPath,
    outputPath,
    options.outputFileSuffix,
    options.inputFileSuffix
  )

  const project = createProject()
  const entityTypes = findEntityTypes(project, normalizedPath)
  const entities = entityTypes.map(type => extractEntityMeta(type))

  const transformedEntities = entities.map((entity) => {
    if (transformData) {
      return transformData(entity)
    }

    return entity
  })

  builder.addFile(`${name}-builder`, {
    path,
    skipIfExists: true,
    templateFile: options.templateFile,
    data: { entities: transformedEntities }
  })

  builder.addManipulation((): string => {
    manipulateFile(path, (file) => {
      for (const entityType of entityTypes) {
        if (entityType instanceof ClassDeclaration) {
          importClassWithProperties(file, entityType)
        } else {
          importInterfaceWithProperties(file, entityType)
        }
      }
    })

    return 'Add imports for builder'
  })

  return {
    path,
    name: `${camelCase(name)}Builder`
  }
}

function findEntityTypes (
  project: Project,
  entityPath: string
): EntityType[] {
  const entityFile = project.addSourceFileAtPathIfExists(entityPath)

  if (entityFile == null) {
    throw new Error(`Entity file ${entityPath} not found`)
  }

  const interfaces = entityFile.getInterfaces()
  const classes = entityFile.getClasses()
  const types = [...interfaces, ...classes]

  if (types.length === 0) {
    throw new Error(`No entity types found in ${entityPath}`)
  }

  return types
}

function extractEntityMeta (type: EntityType): EntityMeta {
  let entityType: string
  let properties: PropertyMeta[]

  if (type instanceof InterfaceDeclaration) {
    entityType = type.getName()
    properties = type.getProperties().map(property => extractPropertyMeta(property))
  } else {
    entityType = type.getNameOrThrow()
    properties = type.getProperties().map(property => extractPropertyMeta(property))
  }

  return {
    entityType,
    entityName: camelCase(entityType),
    isInterface: type instanceof InterfaceDeclaration,
    properties: properties
  }
}

function generateOutputPathAndName (
  inputPath: string,
  outputPath: string,
  outputSuffix: string,
  suffix?: string
): { path: string, name: string } {
  const sanitizedOutputPath = sanitizePath(outputPath)

  const inputFileName = path.basename(inputPath, suffix)
  const outputFileName = `${inputFileName}${outputSuffix}`

  let newOutputPath: string

  if (sanitizedOutputPath.length == 0) {
    const basePath = path.dirname(inputPath)

    newOutputPath = path.join(basePath, `${outputFileName}`)
  } else {
    newOutputPath = sanitizedOutputPath
  }

  return {
    path: newOutputPath,
    name: outputFileName
  }
}
