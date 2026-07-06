import type {
  Field,
  GroupField,
} from 'payload'

import { CTA_EVENTS } from '#cta.field.ts'
import { getLinkField } from '#link.field.ts'

export interface GetNavLinkFieldOptions {
  hasDropdownLinks?: boolean
  isTranslatable?: boolean
  label: GroupField['label']
  name: string
}

export function getNavLinkField({
  isTranslatable = false,
  name,
  label,
}: GetNavLinkFieldOptions): GroupField {
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
        {
          label: 'Dropdown',
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
      options: CTA_EVENTS,
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
          label: 'Label',
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
          options: CTA_EVENTS,
          required: true,
          type: 'select',
        },
      ],
      label: 'Links',
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
