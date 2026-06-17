import fs from 'fs'
import { updatePermissionTranslations } from './permission-translation.generator.js'
import { updateEventLogTranslations } from './event-log-translation.generator.js'
import { updateNotificationTranslations } from './notification-translation.generator.js'
import { TranslationOptions } from '#src/type.js'
import { Builder } from '#src/builder/builder.js'

export const LOCALIZATION_RESOURCES_PATH = 'src/modules/localization/resources'
export const LOCALIZATION_PLACEHOLDER = ''

export function generateTranslations (
  builder: Builder,
  options: TranslationOptions
) {
  if (options.type === 'permissions') {
    updatePermissionTranslations(builder, options)
  } else if (options.type === 'notifications') {
    updateNotificationTranslations(builder, options)
  } else if (options.type === 'eventLogs') {
    updateEventLogTranslations(builder, options)
  }
}

export function getSupportedLanguages (): string[] {
  const files = fs.readdirSync(LOCALIZATION_RESOURCES_PATH, { withFileTypes: true })

  return files.filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
}

export function getTranslationFile (language: string, fileName: string): string {
  return `${LOCALIZATION_RESOURCES_PATH}/${language}/${fileName}.json`
}
