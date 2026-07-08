import type {
  ArrayField,
  Field,
  GroupField,
} from 'payload'

import { getNavLinkField } from '#navLink.field.ts'

export interface GetNavLinksFieldOptions {
  hasDropdownLinks?: boolean
  isTranslatable?: boolean
  name: string
  label: GroupField['label']
  maxItems?: number
  minItems?: number
}

export function getNavLinksField({
  hasDropdownLinks = false,
  isTranslatable = false,
  name,
  label,
  maxItems,
  minItems,
}: GetNavLinksFieldOptions): ArrayField {
  const field: Field = {
    name,
    fields: [
      getNavLinkField({
        hasDropdownLinks,
        isTranslatable,
        name: 'navLink',
        label: {
          en: 'Navigation link',
          nl: 'Navigatielink',
        },
      }),
    ],
    label,
    maxRows: maxItems,
    minRows: minItems,
    required: false,
    type: 'array',
  }

  return field
}
