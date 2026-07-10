import {
  getLinkField,
  getNavLinksField,
} from '@wisemen/payload-core-links'
import { getDefaultEventOptions } from '@wisemen/payload-core-utils'
import type { CollectionConfig } from 'payload'

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
            label: 'General',
          },
          {
            name: 'contact',
            fields: [
              {
                name: 'email',
                label: 'Email',
                type: 'email',
              },
              {
                name: 'phone',
                label: 'Phone',
                type: 'text',
              },
              {
                name: 'whatsappLink',
                label: 'WhatsApp link',
                type: 'text',
              },
            ],
            label: 'Contact',
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
            label: 'Home page',
          },
          {
            name: 'header',
            fields: [
              getNavLinksField({
                hasDropdownLinks: true,
                isTranslatable: true,
                name: 'links',
                label: 'Header links',
              }),
              getNavLinksField({
                hasDropdownLinks: true,
                isTranslatable: true,
                name: 'subheaderLinks',
                label: 'Subheader links',
              }),
            ],
            label: 'Header',
          },
          {
            name: 'footer',
            fields: [
              {
                name: 'sections',
                fields: [
                  {
                    name: 'title',
                    label: 'Title',
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
                        label: 'Type',
                        options: [
                          {
                            label: 'Link',
                            value: 'link',
                          },
                          {
                            label: 'Event',
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
                            label: 'Default',
                            value: 'default',
                          },
                          {
                            label: 'Highlighted',
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
                    label: 'Links',
                    required: false,
                    type: 'array',
                  },
                ],
                label: 'Footer sections',
                type: 'array',
              },
            ],
            label: 'Footer',
          },
          {
            name: 'socials',
            fields: [
              {
                name: 'facebook',
                label: 'Facebook',
                type: 'text',
              },
              {
                name: 'instagram',
                label: 'Instagram',
                type: 'text',
              },
              {
                name: 'linkedin',
                label: 'LinkedIn',
                type: 'text',
              },
              {
                name: 'youtube',
                label: 'YouTube',
                type: 'text',
              },
              {
                name: 'pinterest',
                label: 'Pinterest',
                type: 'text',
              },
              {
                name: 'tiktok',
                label: 'TikTok',
                type: 'text',
              },
            ],
            label: 'Socials',
          },
        ],
        type: 'tabs',
      },
    ],
    hooks: hooks?.settings,
    labels: {
      plural: 'Settings',
      singular: 'Settings',
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
