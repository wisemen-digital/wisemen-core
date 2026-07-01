import { definePlugin } from 'payload'

import {
  createTranslationStatusAfterChangeHook,
  createTranslationStatusBeforeChangeHook,
  ensureTranslationStatusColumn,
  ensureTranslationStatusField,
} from '#collections/index.ts'
import { createTranslationEndpointHandler } from '#runtime/index.ts'
import { ensureTranslationSettingsFields } from '#settings/index.ts'
import { resolveFieldSelections } from '#translation.engine.ts'
import type {
  TranslatableCollectionDefinition,
  TranslationPluginOptions,
} from '#types.ts'

const DEFAULT_ENDPOINT_PATH = '/translate-locale'

export const payloadTranslatePlugin = definePlugin<TranslationPluginOptions>({
  plugin: ({
    access,
    adapters,
    collections,
    config,
    endpointPath = DEFAULT_ENDPOINT_PATH,
    richText,
    translations,
  }) => {
    const collectionDefinitions = new Map<string, TranslatableCollectionDefinition<Record<string, unknown>, string>>(
      collections.map((definition) => [
        definition.slug,
        definition,
      ]),
    )

    if (translations) {
      const translationSettingsTarget = translations.type === 'collection'
        ? config.collections?.find((collection) => collection.slug === translations.slug)
        : config.globals?.find((global) => global.slug === translations.slug)

      if (translationSettingsTarget) {
        translationSettingsTarget.fields = ensureTranslationSettingsFields(
          {
            access,
            adapterDefinitions: adapters,
            collectionSlug: translations.slug,
            fields: translationSettingsTarget.fields ?? [],
            translations,
          },
        )
      }
    }

    for (const collection of config.collections ?? []) {
      const definition = collectionDefinitions.get(collection.slug)

      if (!definition) {
        continue
      }

      resolveFieldSelections(collection.fields ?? [], definition.translatableFields)
      collection.fields = ensureTranslationStatusField(collection.fields ?? [], collection.slug)

      collection.admin ??= {}
      collection.admin.defaultColumns = ensureTranslationStatusColumn(collection.admin.defaultColumns)
      collection.admin.components ??= {}
      collection.admin.components.edit ??= {}
      collection.admin.components.edit.editMenuItems ??= []
      collection.admin.components.edit.editMenuItems.push({
        clientProps: {
          collectionSlug: collection.slug,
          endpointPath,
        },
        path: '@repo/payload-translate/server#TranslateMenuItemsServer',
      })
      collection.hooks ??= {}
      collection.hooks.beforeChange = [
        ...(collection.hooks.beforeChange ?? []),
        createTranslationStatusBeforeChangeHook(
          resolveFieldSelections(collection.fields ?? [], definition.translatableFields)
            .map((selection) => selection.dataPath),
        ),
      ]
      collection.hooks.afterChange = [
        ...(collection.hooks.afterChange ?? []),
        createTranslationStatusAfterChangeHook({
          collectionSlug: collection.slug,
          defaultLocale: typeof config.localization === 'object' ? config.localization.defaultLocale : undefined,
          locales: typeof config.localization === 'object'
            ? config.localization.locales.map((locale) => typeof locale === 'string' ? locale : locale.code)
            : [],
        }),
      ]
    }

    config.endpoints ??= []
    config.endpoints.push({
      handler: createTranslationEndpointHandler({
        access,
        adapterDefinitions: adapters,
        collections: collectionDefinitions,
        config,
        richText,
        translations,
      }),
      method: 'post',
      path: `${endpointPath}/:collection`,
    })

    return config
  },
  slug: 'payload-translate',
})
