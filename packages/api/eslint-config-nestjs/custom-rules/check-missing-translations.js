/* eslint-disable no-console */
import { readFileSync, existsSync, statSync } from 'fs'
import { join } from 'path'

// Default paths (can be overridden via options)
const DEFAULT_TRANSLATION_PATH = 'src/modules/localization/resources'
const DEFAULT_DOMAIN_EVENT_FILE = 'src/modules/domain-events/domain-event-type.ts'
const DEFAULT_PERMISSION_FILE = 'src/modules/permission/permission.enum.ts'
const DEFAULT_LOCALE_ENUM_FILE = 'src/modules/localization/enums/locale.enum.ts'

let cachedLocales = null
let cachedEventTypes = null
let cachedPermissionTypes = null
const cachedEventVersionsByLocale = new Map()
const cachedPermissionsByLocale = new Map()
const fileModificationTimes = new Map()

function safeReadFile (filePath) {
  try {
    return readFileSync(filePath, 'utf8')
  } catch {
    return null
  }
}

function getFileModificationTime (filePath) {
  try {
    return statSync(filePath).mtime.getTime()
  } catch {
    return 0
  }
}

function isFileModified (filePath) {
  const currentMtime = getFileModificationTime(filePath)
  const cachedMtime = fileModificationTimes.get(filePath) || 0

  if (currentMtime > cachedMtime) {
    fileModificationTimes.set(filePath, currentMtime)

    return true
  }

  return false
}

function parseEnumValues (fileContent, enumName) {
  if (!fileContent) return []
  const regex = new RegExp(`export\\s+enum\\s+${enumName}\\s*{([^}]+)}`, 's')
  const match = fileContent.match(regex)

  if (!match) return []

  const body = match[1]
  const values = []

  // Matches something like: NAME = 'value',
  for (const m of body.matchAll(/\w+\s*=\s*['"`]([^'"`]+)['"`]/g)) {
    values.push(m[1])
  }

  return values
}

function getAvailableLocales (localeEnumFile = DEFAULT_LOCALE_ENUM_FILE) {
  const localeFilePath = join(process.cwd(), localeEnumFile)

  if (cachedLocales && !isFileModified(localeFilePath)) {
    return cachedLocales
  }

  const content = safeReadFile(localeFilePath)

  cachedLocales = parseEnumValues(content, 'Locale')

  return cachedLocales
}

function getPermissionTypes (permissionFile = DEFAULT_PERMISSION_FILE) {
  const permissionsFilePath = join(process.cwd(), permissionFile)

  if (cachedPermissionTypes && !isFileModified(permissionsFilePath)) {
    return cachedPermissionTypes
  }

  const content = safeReadFile(permissionsFilePath)

  cachedPermissionTypes = parseEnumValues(content, 'Permission')

  return cachedPermissionTypes
}

function getDomainEventTypes (domainEventFile = DEFAULT_DOMAIN_EVENT_FILE) {
  const eventTypesFilePath = join(process.cwd(), domainEventFile)

  if (cachedEventTypes && !isFileModified(eventTypesFilePath)) {
    return cachedEventTypes
  }

  const content = safeReadFile(eventTypesFilePath)

  cachedEventTypes = parseEnumValues(content, 'DomainEventType')

  return cachedEventTypes
}

function extractEventVersionsFromTranslations (locale, translationPath = DEFAULT_TRANSLATION_PATH) {
  const translationFile = join(process.cwd(), translationPath, locale, 'event-log.json')

  if (!existsSync(translationFile)) {
    cachedEventVersionsByLocale.set(locale, {})

    return {}
  }

  // Check if file was modified or not cached yet
  if (cachedEventVersionsByLocale.has(locale) && !isFileModified(translationFile)) {
    return cachedEventVersionsByLocale.get(locale)
  }

  try {
    const content = JSON.parse(readFileSync(translationFile, 'utf8'))
    const eventVersions = {}

    function recurse (obj, prefix = '') {
      for (const [key, value] of Object.entries(obj)) {
        const currentPath = prefix ? `${prefix}.${key}` : key

        if (key.startsWith('v') && typeof value === 'string') {
          const versionNum = parseInt(key.slice(1), 10)

          if (Number.isInteger(versionNum)) {
            const eventType = prefix

            if (!eventVersions[eventType]) eventVersions[eventType] = []

            eventVersions[eventType].push(versionNum)
          }
        } else if (typeof value === 'object' && value !== null) {
          recurse(value, currentPath)
        }
      }
    }

    recurse(content)
    cachedEventVersionsByLocale.set(locale, eventVersions)

    return eventVersions
  } catch (err) {
    // Return empty but log once for visibility
    console.warn(`[eslint-translation-rule] Failed to parse ${translationFile}: ${err.message}`)
    cachedEventVersionsByLocale.set(locale, {})

    return {}
  }
}

function extractPermissionsFromTranslations (locale, translationPath = DEFAULT_TRANSLATION_PATH) {
  const translationFile = join(process.cwd(), translationPath, locale, 'permissions.json')

  if (!existsSync(translationFile)) {
    cachedPermissionsByLocale.set(locale, new Set())

    return new Set()
  }

  // Check if file was modified or not cached yet
  if (cachedPermissionsByLocale.has(locale) && !isFileModified(translationFile)) {
    return cachedPermissionsByLocale.get(locale)
  }

  try {
    const content = JSON.parse(readFileSync(translationFile, 'utf8'))
    const permissions = new Set()

    function recurse (obj, prefix = '') {
      for (const [key, value] of Object.entries(obj)) {
        const currentPath = prefix ? `${prefix}.${key}` : key

        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          // Check if this is a permission object (has name and description)
          if (value.name && value.description) {
            permissions.add(currentPath)
          } else if (value['group-name']) {
            // This is a group, recurse into it but don't add the group itself
            recurse(value, currentPath)
          } else {
            // Regular nested object, recurse
            recurse(value, currentPath)
          }
        }
      }
    }

    recurse(content)
    cachedPermissionsByLocale.set(locale, permissions)

    return permissions
  } catch (err) {
    console.warn(`[eslint-translation-rule] Failed to parse ${translationFile}: ${err.message}`)
    cachedPermissionsByLocale.set(locale, new Set())

    return new Set()
  }
}

function findMissingTranslations (options = {}) {
  const {
    localeEnumFile = DEFAULT_LOCALE_ENUM_FILE,
    domainEventFile = DEFAULT_DOMAIN_EVENT_FILE,
    permissionFile = DEFAULT_PERMISSION_FILE,
    translationPath = DEFAULT_TRANSLATION_PATH
  } = options

  const locales = getAvailableLocales(localeEnumFile)
  const eventTypes = getDomainEventTypes(domainEventFile)
  const permissionTypes = getPermissionTypes(permissionFile)

  const issues = []

  for (const locale of locales) {
    const versionsByEvent = extractEventVersionsFromTranslations(locale, translationPath)
    const availablePermissions = extractPermissionsFromTranslations(locale, translationPath)

    // Check domain events
    for (const eventType of eventTypes) {
      const versions = versionsByEvent[eventType] || []
      const eventIssues = []

      if (versions.length === 0) {
        eventIssues.push('No translations found')
      } else {
        // Ensure v1 exists
        if (!versions.includes(1)) eventIssues.push('Missing v1 translation')

        const maxVersion = Math.max(...versions)

        for (let v = 1; v <= maxVersion; v++) {
          if (!versions.includes(v)) eventIssues.push(`Missing v${v} translation`)
        }
      }

      if (eventIssues.length > 0) {
        issues.push({
          locale,
          type: 'event',
          key: eventType,
          issues: eventIssues,
          translationFile: 'event-log.json',
          translationPath
        })
      }
    }

    // Check permissions
    for (const permissionType of permissionTypes) {
      // Convert permission enum value to translation key format
      // e.g., 'contact.create' stays 'contact.create', 'all_permissions' stays 'all_permissions'
      const translationKey = permissionType.replace(/_/g, '_') // Keep underscores for special permissions

      if (!availablePermissions.has(translationKey)) {
        issues.push({
          locale,
          type: 'permission',
          key: permissionType,
          issues: ['No translation found'],
          translationFile: 'permissions.json',
          translationPath
        })
      }
    }
  }

  return issues
}

const rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensure all domain events and permissions have translations in all locales',
      category: 'Possible Errors'
    },
    schema: [
      {
        type: 'object',
        properties: {
          ignoreLocales: { type: 'array', items: { type: 'string' } },
          translationPath: { type: 'string' },
          domainEventFile: { type: 'string' },
          permissionFile: { type: 'string' },
          localeEnumFile: { type: 'string' }
        },
        additionalProperties: false
      }
    ]
  },

  create (context) {
    const filename = context.getFilename()
    const options = context.options[0] || {}
    const ignored = new Set(options.ignoreLocales || [])

    const isDomainEventFile = filename.includes('domain-event-type.ts')
    const isPermissionFile = filename.includes('permission.enum.ts')

    // Only run on domain-event-type.ts or permission.enum.ts
    if (!isDomainEventFile && !isPermissionFile) {
      return {}
    }

    return {
      Program (node) {
        // Recalculate missing translations on each run to detect file changes
        const missingTranslations = findMissingTranslations(options)

        for (const missingTranslation of missingTranslations) {
          const { locale, type, key, issues, translationFile, translationPath } = missingTranslation

          if (ignored.has(locale)) continue

          // Only show domain event errors when linting domain-event-type.ts
          if (isDomainEventFile && type !== 'event') continue

          // Only show permission errors when linting permission.enum.ts
          if (isPermissionFile && type !== 'permission') continue

          for (const issue of issues) {
            const translationFilePath = join(
              process.cwd(),
              translationPath,
              locale,
              translationFile
            )

            const typeLabel = type === 'event' ? 'domain event' : 'permission'

            context.report({
              node,
              message: `Missing translation for ${typeLabel} "${key}" in locale "${locale}": ${issue}. Please add to ${translationFilePath}. Or use npx @wisemen/ngen to auto-generate missing translation keys.`
            })
          }
        }
      }
    }
  }
}

export default rule
