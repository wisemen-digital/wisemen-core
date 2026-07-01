/* eslint-disable eslint-plugin-wisemen/explicit-function-return-type-with-regex */
import type { Field } from 'payload'

import type {
  TranslationAccess,
  TranslationAdapterDefinition,
  TranslationPluginOptions,
} from '#types.ts'
import {
  canAccessTranslation,
  isPlainObject,
} from '#utils/index.ts'

interface TranslationSettingsFieldArgs {
  access?: TranslationAccess
  adapterDefinitions: readonly TranslationAdapterDefinition[]
  collectionSlug?: string
  translations?: TranslationPluginOptions['translations']
}

export function ensureTranslationSettingsFields({
  access,
  adapterDefinitions,
  collectionSlug,
  fields,
  translations,
}: TranslationSettingsFieldArgs & { fields: Field[] }): Field[] {
  if (adapterDefinitions.length === 0) {
    return fields
  }

  const existingGroup = fields.find((field) => field.type === 'group' && 'name' in field && field.name === 'translations')

  if (existingGroup && 'fields' in existingGroup) {
    const tabsField = existingGroup.fields.find((field) => field.type === 'tabs')

    if (tabsField && 'tabs' in tabsField) {
      tabsField.tabs = mergeAdapterTabs(tabsField.tabs, adapterDefinitions)
    }

    if (access) {
      existingGroup.access = {
        ...existingGroup.access,
        read: async (args) => await canAccessTranslation(access, {
          collectionSlug,
          document: args.doc ? (args.doc as Record<string, unknown>) : undefined,
          req: args.req,
          translations,
        }),
      }
    }

    return fields
  }

  return [
    ...fields,
    createTranslationSettingsField({
      access,
      adapterDefinitions,
      collectionSlug,
      translations,
    }),
  ]
}

export function createTranslationSettingsField({
  access,
  adapterDefinitions,
  collectionSlug,
  translations,
}: TranslationSettingsFieldArgs): Field {
  return {
    name: 'translations',
    access: access
      ? {
          read: async (args) => await canAccessTranslation(access, {
            collectionSlug,
            document: args.doc ? (args.doc as Record<string, unknown>) : undefined,
            req: args.req,
            translations,
          }),
        }
      : undefined,
    fields: [
      {
        label: 'Translations',
        tabs: adapterDefinitions.map((definition) => ({
          name: definition.key,
          fields: definition.fields ?? [],
          label: definition.label,
        })),
        type: 'tabs',
      },
    ],
    label: 'Translations',
    type: 'group',
  }
}

export function extractTranslationAdapterSettings(document: unknown): Record<string, unknown> {
  if (!isPlainObject(document) || !isPlainObject(document.translations)) {
    return {}
  }

  return document.translations
}

function mergeAdapterTabs(
  tabs: NonNullable<Extract<Field, { type: 'tabs' }>['tabs']>,
  adapterDefinitions: readonly TranslationAdapterDefinition[],
): NonNullable<Extract<Field, { type: 'tabs' }>['tabs']> {
  const existing = new Set(tabs.map((tab) => ('name' in tab && typeof tab.name === 'string' ? tab.name : tab.label)))

  return [
    ...tabs,
    ...adapterDefinitions
      .filter((definition) => !existing.has(definition.key))
      .map((definition) => ({
        name: definition.key,
        fields: definition.fields ?? [],
        label: definition.label,
      })),
  ]
}
