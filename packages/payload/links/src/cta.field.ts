import { getDefaultEventOptions } from '@wisemen/payload-core-utils'
import type {
  Condition,
  Field,
  GroupField,
} from 'payload'

import { getLinkField } from '#link.field.ts'

export interface GetCtaFieldOptions {
  name: string
  condition?: Condition<any, any>
  label: GroupField['label']
}

export const CTA_EVENTS = []

export function getCtaField({
  name,
  condition,
  label,
}: GetCtaFieldOptions): GroupField {
  const defaultEventOptions = getDefaultEventOptions()
  const fields: Field[] = [
    {
      name: 'label',
      required: true,
      type: 'text',
    },
    {
      name: 'ctaVariant',
      defaultValue: 'primary',
      enumName: 'cta_variant',
      label: 'Variant',
      options: [
        {
          label: 'Primary',
          value: 'primary',
        },
        {
          label: 'Secondary',
          value: 'secondary',
        },
      ],
      type: 'select',
    },
    {
      name: 'ctaType',
      defaultValue: 'link',
      enumName: 'cta_type',
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
      type: 'select',
    },
    getLinkField({
      disableLabel: true,
      overrides: {
        admin: {
          condition: (_, siblingData) => siblingData?.ctaType === 'link',
        },
      },
    }),
    {
      name: 'event',
      admin: {
        condition: (_, siblingData) => siblingData?.ctaType === 'event',
      },
      defaultValue: undefined,
      enumName: 'cta_event',
      options: defaultEventOptions.length > 0 ? defaultEventOptions : CTA_EVENTS,
      type: 'select',
    },
  ]

  return {
    name,
    admin: {
      condition,
    },
    fields,
    interfaceName: 'CtaField',
    label,
    type: 'group',
  }
}
