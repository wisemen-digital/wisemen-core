import { NodePlopAPI } from 'plop'
import { Builder } from '#src/builder/builder.js'
import { TranslationOptions } from '#src/type.js'
import { generateTranslations, getSupportedLanguages } from '#src/generators/translations/translation.generator.js'

export function setTranslationGenerator (plop: NodePlopAPI) {
  plop.setGenerator('translations', {
    description: 'Generate template for translations',
    prompts: [
      {
        type: 'list',
        name: 'type',
        message: 'For what would you like to generate translations?',
        choices: [
          { name: 'Permissions', value: 'permissions' },
          { name: 'Notifications', value: 'notifications' },
          { name: 'Event logs', value: 'eventLogs' }
        ],
        default: 'permissions'
      },
      {
        type: 'checkbox',
        name: 'languages',
        message: 'Select the languages for which you want to generate translations',
        choices: () => {
          return getSupportedLanguages().map(language => ({
            name: language,
            checked: true
          }))
        }
      }
    ],
    actions: (answers: TranslationOptions) => {
      const builder = new Builder()

      generateTranslations(builder, answers)

      return builder.build()
    }
  })
}
