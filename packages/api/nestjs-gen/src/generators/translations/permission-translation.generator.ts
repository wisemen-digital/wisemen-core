/* eslint-disable @typescript-eslint/naming-convention */
import fs from 'fs'
import { EnumDeclaration, Project } from 'ts-morph'
import { getTranslationFile, LOCALIZATION_PLACEHOLDER } from './translation.generator.js'
import { Builder } from '#src/builder/builder.js'
import { TranslationOptions } from '#src/type.js'
import { PermissionResolverRegistry } from '#src/registry/permission.registry.js'

interface PermissionNode {
  'group-name'?: string
  'name'?: string
  'description'?: string
  [key: string]: PermissionNode | string | undefined
}

export function updatePermissionTranslations (
  builder: Builder,
  options: TranslationOptions
): void {
  builder.addManipulation((): string => {
    const permissionEnum = getPermissionEnum()

    for (const language of options.languages) {
      const filePath = getTranslationFile(language, 'permissions')
      const oldJSON = getJSONFromFile(filePath)

      const json = generateGroupJSON(permissionEnum, oldJSON)
      const sortedJSON = sortGroupJSON(json)

      fs.writeFileSync(filePath, JSON.stringify(sortedJSON, null, '\t'), 'utf-8')
    }

    return 'Updated permission translations'
  })
}

function generateGroupJSON (
  permissionEnum: EnumDeclaration,
  oldJSON: Record<string, PermissionNode>
): Record<string, PermissionNode> {
  const json: Record<string, PermissionNode> = {}

  for (const member of permissionEnum.getMembers()) {
    const initializer = member.getInitializerOrThrow()
    const value = initializer.getText().replace(/^['"`](.*)['"`]$/, '$1')

    const segments = value.split('.')
    const groupKey = segments[0]

    json[groupKey] ??= {}

    let current = json[groupKey]
    let oldCurrent: PermissionNode | undefined = oldJSON[groupKey]

    current['group-name'] = oldCurrent?.['group-name'] ?? LOCALIZATION_PLACEHOLDER

    if (segments.length === 1) {
      current.name = oldCurrent?.name ?? LOCALIZATION_PLACEHOLDER
      current.description = oldCurrent?.description ?? LOCALIZATION_PLACEHOLDER

      continue
    }

    for (let i = 1; i < segments.length; i++) {
      const segment = segments[i]

      if (current[segment] == null || typeof current[segment] !== 'object') {
        current[segment] = {}
      }

      current = current[segment]
      oldCurrent = oldCurrent?.[segment] as PermissionNode | undefined

      if (i === segments.length - 1) {
        current.name = oldCurrent?.name ?? LOCALIZATION_PLACEHOLDER
        current.description = oldCurrent?.description ?? LOCALIZATION_PLACEHOLDER
      } else {
        current.name = undefined
        current.description = undefined
      }
    }
  }

  return json
}

function sortGroupJSON (json: Record<string, PermissionNode>): Record<string, PermissionNode> {
  const ordered: Record<string, PermissionNode> = {}
  const keys = Object.keys(json)

  reorderKeys(keys, ['group-name', 'name', 'description'])

  for (const key of keys) {
    const value = json[key]

    if (typeof value === 'object') {
      ordered[key] = sortGroupJSON(value as Record<string, PermissionNode>)
    } else {
      ordered[key] = value
    }
  }

  return ordered
}

function reorderKeys (keys: string[], specialKeys: string[]) {
  keys.sort()

  for (let i = specialKeys.length - 1; i >= 0; i--) {
    const key = specialKeys[i]
    const index = keys.indexOf(key)

    if (index !== -1) {
      keys.splice(index, 1)
      keys.unshift(key)
    }
  }
}

function getJSONFromFile (filePath: string): Record<string, PermissionNode> {
  if (!fs.existsSync(filePath)) {
    return { }
  }

  const contents = fs.readFileSync(filePath, 'utf-8')

  if (contents.length === 0) {
    return { }
  }

  return JSON.parse(contents) as Record<string, PermissionNode>
}

function getPermissionEnum (): EnumDeclaration {
  const permissionEnum = PermissionResolverRegistry.resolveImport('permissionEnum')

  if (permissionEnum == null) {
    throw new Error('Permission enum not found')
  }

  const project = new Project()
  const sourceFile = project.addSourceFileAtPath(permissionEnum.path)

  return sourceFile.getEnumOrThrow(permissionEnum.name)
}
