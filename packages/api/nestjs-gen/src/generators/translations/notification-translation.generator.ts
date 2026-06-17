/* eslint-disable @typescript-eslint/naming-convention */
import fs from 'fs'
import { EnumDeclaration, Project } from 'ts-morph'
import { getTranslationFile, LOCALIZATION_PLACEHOLDER } from './translation.generator.js'
import { Builder } from '#src/builder/builder.js'
import { TranslationOptions } from '#src/type.js'
import { NotificationResolverRegistry } from '#src/registry/notification.registry.js'

interface NotificationNode {
  'group-name'?: string
  'group-description'?: string
  'content'?: string
  'description'?: string
  [key: string]: NotificationNode | string | undefined
}

export function updateNotificationTranslations (
  builder: Builder,
  options: TranslationOptions
): void {
  builder.addManipulation((): string => {
    const notificationEnum = getNotificationTypeEnum()

    for (const language of options.languages) {
      const filePath = getTranslationFile(language, 'notifications')
      const oldJSON = getJSONFromFile(filePath)

      const json = generateGroupJSON(notificationEnum, oldJSON)
      const sortedJSON = sortGroupJSON(json)

      fs.writeFileSync(filePath, JSON.stringify(sortedJSON, null, '\t'), 'utf-8')
    }

    return 'Updated notification translations'
  })
}

function generateGroupJSON (
  notificationEnum: EnumDeclaration,
  oldJSON: Record<string, NotificationNode>
): Record<string, NotificationNode> {
  const json: Record<string, NotificationNode> = {}

  for (const member of notificationEnum.getMembers()) {
    const initializer = member.getInitializerOrThrow()
    const value = initializer.getText().replace(/^['"`](.*)['"`]$/, '$1')

    const segments = value.split('.')
    const groupKey = segments[0]

    json[groupKey] ??= {}

    let current = json[groupKey]
    let oldCurrent: NotificationNode | undefined = oldJSON[groupKey]

    current['group-name'] = oldCurrent?.['group-name'] ?? LOCALIZATION_PLACEHOLDER
    current['group-description'] = oldCurrent?.['group-description'] ?? LOCALIZATION_PLACEHOLDER

    if (segments.length === 1) {
      current.content = oldCurrent?.content ?? LOCALIZATION_PLACEHOLDER
      current.description = oldCurrent?.description ?? LOCALIZATION_PLACEHOLDER

      continue
    }

    for (let i = 1; i < segments.length; i++) {
      const segment = segments[i]

      if (current[segment] == null || typeof current[segment] !== 'object') {
        current[segment] = {}
      }

      current = current[segment]
      oldCurrent = oldCurrent?.[segment] as NotificationNode | undefined

      if (i === segments.length - 1) {
        delete current['group-description']
        current.content = oldCurrent?.content ?? LOCALIZATION_PLACEHOLDER
        current.description = oldCurrent?.description ?? LOCALIZATION_PLACEHOLDER
      } else {
        current['group-description'] = oldCurrent?.['group-description'] ?? LOCALIZATION_PLACEHOLDER
        current.content = undefined
        current.description = undefined
      }
    }
  }

  return json
}

function sortGroupJSON (json: Record<string, NotificationNode>): Record<string, NotificationNode> {
  const ordered: Record<string, NotificationNode> = {}
  const keys = Object.keys(json)

  reorderKeys(keys, ['group-name', 'group-description', 'content', 'description'])

  for (const key of keys) {
    const value = json[key]

    if (typeof value === 'object') {
      ordered[key] = sortGroupJSON(value as Record<string, NotificationNode>)
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

function getJSONFromFile (filePath: string): Record<string, NotificationNode> {
  if (!fs.existsSync(filePath)) {
    return { }
  }

  const contents = fs.readFileSync(filePath, 'utf-8')

  if (contents.length === 0) {
    return { }
  }

  return JSON.parse(contents) as Record<string, NotificationNode>
}

function getNotificationTypeEnum (): EnumDeclaration {
  const notificationTypeEnum = NotificationResolverRegistry.resolveImport('notificationTypeEnum')

  if (notificationTypeEnum == null) {
    throw new Error('Notification type enum not found')
  }

  const project = new Project()
  const sourceFile = project.addSourceFileAtPath(notificationTypeEnum.path)

  return sourceFile.getEnumOrThrow(notificationTypeEnum.name)
}
