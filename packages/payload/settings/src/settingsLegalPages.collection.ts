import { getSimpleRichTextField } from '@wisemen/payload-core-utils'
import type { CollectionConfig } from 'payload'

import type { GetSettingsCollectionDependencies } from '#collections/settings.collection.ts'

import { t } from './i18n/index.ts'

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
                label: t('general.terms_conditions_content'),
                localized: true,
              }),
            ],
            label: t('general.terms_conditions'),
          },
          {
            fields: [
              getSimpleRichTextField({
                name: 'cookiePolicy',
                label: t('general.cookie_policy_content'),
                localized: true,
              }),
            ],
            label: t('general.cookie_policy'),
          },
          {
            fields: [
              getSimpleRichTextField({
                name: 'privacyPolicy',
                label: t('general.privacy_policy_content'),
                localized: true,
              }),
            ],
            label: t('general.privacy_policy'),
          },
        ],
        type: 'tabs',
      },
    ],
    hooks: hooks?.settingsLegalPages,
    labels: {
      plural: t('general.legal_pages'),
      singular: t('general.legal_pages'),
    },
    slug: 'settingsLegalPages',
  }
}
