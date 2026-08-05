import {
  getLinkField,
  getNavLinksField,
} from '@wisemen/payload-core-links'
import { getDefaultEventOptions } from '@wisemen/payload-core-utils'
import type { CollectionConfig } from 'payload'

import { t } from '#i18n/index.ts'
import { getSettingsLegalPagesCollection } from '#settingsLegalPages.collection.ts'

export type SettingsCollectionSlug = 'settings' | 'settingsLegalPages'

type SettingsCollectionHooks = Partial<Record<SettingsCollectionSlug, CollectionConfig['hooks']>>

export interface GetSettingsCollectionDependencies {
  access: CollectionConfig['access']
  hooks?: SettingsCollectionHooks
}

export function getSettingsCollection({
  access, hooks,
}: GetSettingsCollectionDependencies): CollectionConfig {
  const defaultEventOptions = getDefaultEventOptions()

  return {
    access,
    fields: [
      {
        tabs: [
          {
            name: 'general',
            fields: [
              {
                // TODO set default value
                name: 'adminEmail',
                defaultValue: 'example@gmail.com',
                label: 'Admin email',
                type: 'email',
              },
            ],
            label: t('general.general'),
          },
          {
            name: 'contact',
            fields: [
              {
                name: 'email',
                label: t('general.email'),
                type: 'email',
              },
              {
                name: 'phone',
                label: t('general.phone'),
                type: 'text',
              },
              {
                name: 'whatsappLink',
                label: t('general.whats_app_link'),
                type: 'text',
              },
            ],
            label: t('contact.contact'),
          },
          {
            name: 'home',
            fields: [
              getLinkField({
                isRequired: true,
                isTranslatable: true,
                name: 'homePage',
                canBeExternal: false,
              }),
            ],
            label: t('general.home_page'),
          },
          {
            name: 'header',
            fields: [
              getNavLinksField({
                hasDropdownLinks: true,
                isTranslatable: true,
                name: 'links',
                label: t('general.header_links'),
              }),
              getNavLinksField({
                hasDropdownLinks: true,
                isTranslatable: true,
                name: 'subheaderLinks',
                label: t('general.subheader_links'),
              }),
            ],
            label: t('general.header'),
          },
          {
            name: 'footer',
            fields: [
              {
                name: 'sections',
                fields: [
                  {
                    name: 'title',
                    label: t('general.title'),
                    localized: true,
                    required: false,
                    type: 'text',
                  },
                  getLinkField({
                    isRequired: false,
                    name: 'link',
                    disableLabel: true,
                  }),
                  {
                    name: 'links',
                    fields: [
                      {
                        name: 'navType',
                        defaultValue: 'link',
                        enumName: 'footer_nav_link_type',
                        label: t('general.type'),
                        options: [
                          {
                            label: t('general.link'),
                            value: 'link',
                          },
                          {
                            label: t('general.event'),
                            value: 'event',
                          },
                        ],
                        required: true,
                        type: 'select',
                      },
                      {
                        name: 'label',
                        localized: true,
                        required: true,
                        type: 'text',
                      },
                      {
                        name: 'variant',
                        defaultValue: 'default',
                        enumName: 'footer_link_variant',
                        options: [
                          {
                            label: t('general.default'),
                            value: 'default',
                          },
                          {
                            label: t('general.highlighted'),
                            value: 'highlighted',
                          },
                        ],
                        required: true,
                        type: 'select',
                      },
                      getLinkField({
                        name: 'link',
                        disableLabel: true,
                        overrides: {
                          admin: {
                            condition: (_, siblingData) => siblingData?.navType === 'link',
                          },
                        },
                      }),
                      {
                        name: 'event',
                        admin: {
                          condition: (_, siblingData) => siblingData?.navType === 'event',
                        },
                        enumName: 'cta_event',
                        options: defaultEventOptions,
                        required: true,
                        type: 'select',
                      },
                    ],
                    label: t('general.links'),
                    required: false,
                    type: 'array',
                  },
                ],
                label: t('general.footer_sections'),
                type: 'array',
              },
            ],
            label: t('general.footer'),
          },
          {
            name: 'socials',
            fields: [
              {
                name: 'facebook',
                label: t('general.facebook'),
                type: 'text',
              },
              {
                name: 'instagram',
                label: t('general.instagram'),
                type: 'text',
              },
              {
                name: 'linkedin',
                label: t('general.linked_in'),
                type: 'text',
              },
              {
                name: 'youtube',
                label: t('general.you_tube'),
                type: 'text',
              },
              {
                name: 'pinterest',
                label: t('general.pinterest'),
                type: 'text',
              },
              {
                name: 'tiktok',
                label: t('general.tik_tok'),
                type: 'text',
              },
            ],
            label: t('general.socials'),
          },
        ],
        type: 'tabs',
      },
    ],
    hooks: hooks?.settings,
    labels: {
      plural: t('general.settings'),
      singular: t('general.settings'),
    },
    slug: 'settings',
  }
}

export function getSettingsCollections(deps: GetSettingsCollectionDependencies): CollectionConfig[] {
  return [
    getSettingsCollection(deps),
    getSettingsLegalPagesCollection(deps),
  ]
}
