import { getDefaultEventOptions } from '@wisemen/payload-core-utils'
import type {
  Field,
  GroupField,
} from 'payload'

import { CTA_EVENTS } from '#cta.field.ts'
import { getLinkField } from '#link.field.ts'

import { t } from './i18n/index.ts'

export interface GetNavLinkFieldOptions {
  hasDropdownLinks?: boolean
  isTranslatable?: boolean
  name: string
  label: GroupField['label']
}

export function getNavLinkField({
  isTranslatable = false,
  name,
  label,
}: GetNavLinkFieldOptions): GroupField {
  const defaultEventOptions = getDefaultEventOptions()
  const fields: Field[] = [
    {
      name: 'label',
      localized: isTranslatable,
      required: true,
      type: 'text',
    },
    {
      name: 'navType',
      defaultValue: 'link',
      enumName: 'nav_link_type',
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
        {
          label: t('general.dropdown'),
          value: 'dropdown',
        },
      ],
      required: true,
      type: 'select',
    },
    getLinkField({
      isTranslatable,
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
      defaultValue: undefined,
      enumName: 'cta_event',
      options: defaultEventOptions.length > 0 ? defaultEventOptions : CTA_EVENTS,
      required: true,
      type: 'select',
    },
    {
      name: 'links',
      admin: {
        condition: (_, siblingData) => siblingData?.navType === 'dropdown',
      },
      fields: [
        {
          name: 'navType',
          defaultValue: 'link',
          enumName: 'nav_link_type',
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
          label: t('general.label'),
          localized: isTranslatable,
          required: true,
          type: 'text',
        },
        getLinkField({
          hasDropdownCategories: false,
          isTranslatable,
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
          options: defaultEventOptions.length > 0 ? defaultEventOptions : CTA_EVENTS,
          required: true,
          type: 'select',
        },
      ],
      label: t('general.links'),
      required: true,
      type: 'array',
    },
  ]

  return {
    name,
    fields,
    label,
    type: 'group',
  }
}
