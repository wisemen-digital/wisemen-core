import { getSimpleRichTextField } from '@wisemen/payload-core-utils'
import type { CollectionConfig } from 'payload'

import type { GetSettingsCollectionDependencies } from '#collections/settings.collection.ts'

export function getSettingsLegalPagesCollection({
  access, hooks,
}: GetSettingsCollectionDependencies): CollectionConfig {
  return {
    access,
    fields: [
      {
        tabs: [
          {
            fields: [
              getSimpleRichTextField({
                name: 'termsAndConditions',
                label: 'Terms & Conditions content',
                localized: true,
              }),
            ],
            label: 'Terms & Conditions',
          },
          {
            fields: [
              getSimpleRichTextField({
                name: 'cookiePolicy',
                label: 'Cookie Policy content',
                localized: true,
              }),
            ],
            label: 'Cookie Policy',
          },
          {
            fields: [
              getSimpleRichTextField({
                name: 'privacyPolicy',
                label: 'Privacy Policy content',
                localized: true,
              }),
            ],
            label: 'Privacy Policy',
          },
        ],
        type: 'tabs',
      },
    ],
    hooks: hooks?.settingsLegalPages,
    labels: {
      plural: 'Legal pages',
      singular: 'Legal pages',
    },
    slug: 'settingsLegalPages',
  }
}
