/* eslint-disable func-style */
import { defu } from 'defu'
import type {
  CollectionSlug,
  Field,
  GroupField,
} from 'payload'

export type LinkAppearances = 'default' | 'outline'

type LinkType = (options?: {
  hasDropdownCategories?: boolean
  isRequired?: boolean
  isTranslatable?: boolean
  name?: string
  canBeExternal?: boolean
  disableLabel?: boolean
  linkTo?: CollectionSlug[]
  overrides?: Partial<GroupField>
  prefix?: string
}) => Field

const DEFAULT_LINK_TO: CollectionSlug[] = [
  'pages',
  'articles',
]

const DEFAULT_LINK_TYPES = [
  {
    label: 'Internal link',
    value: 'reference',
  },
  {
    label: 'Custom URL',
    value: 'custom',
  },
]

const NO_EXTERNAL_LINK_TYPES = [
  {
    label: 'Internal link',
    value: 'reference',
  },
]

export const getLinkField: LinkType = (
  {
    hasDropdownCategories = false,
    isRequired = true,
    isTranslatable = false,
    name = 'link',
    canBeExternal = true,
    disableLabel = true,
    linkTo = DEFAULT_LINK_TO,
    overrides = {},
  } = {},
) => {
  const linkResult: GroupField = {
    name,
    admin: {
      hideGutter: true,
    },
    fields: [
      {
        fields: [
          {
            name: 'type',
            admin: {
              layout: 'horizontal',
              width: '50%',
            },
            defaultValue: 'reference',
            enumName: 'link_type',
            options: canBeExternal ? DEFAULT_LINK_TYPES : NO_EXTERNAL_LINK_TYPES,
            required: true,
            type: 'radio',
          },
          {
            name: 'newTab',
            admin: {
              style: {
                alignSelf: 'flex-end',
              },
              width: '50%',
            },
            defaultValue: false,
            label: 'Open in new tab',
            required: true,
            type: 'checkbox',
          },
        ],
        required: true,
        type: 'row',
      },
    ],
    interfaceName: hasDropdownCategories ? 'LinkFieldWithCategories' : 'LinkField',
    type: 'group',
  }

  const linkTypes: Field[] = [
    {
      name: 'reference',
      admin: {
        condition: (_, siblingData) => {
          return siblingData?.type === 'reference'
        },
      },
      label: 'Link',
      relationTo: linkTo,
      required: isRequired,
      type: 'relationship',
    },
    {
      name: 'url',
      admin: {
        condition: (_, siblingData) => {
          return siblingData?.type === 'custom'
        },
      },
      label: 'Custom URL',
      required: isRequired,
      type: 'text',
    },
  ]

  if (hasDropdownCategories) {
    linkResult.fields.push({
      name: 'categories',
      fields: [
        {
          name: 'label',
          localized: isTranslatable,
          required: true,
          type: 'text',
        },
        getLinkField({
          hasDropdownCategories: false,
          isRequired: true,
          name: 'category',
          disableLabel: true,
        }),
      ],
      type: 'array',
    })
  }

  if (!disableLabel) {
    linkTypes.map((linkType) => ({
      ...linkType,
      admin: {
        ...linkType.admin,
      },
    }))
  }
  else {
    linkResult.fields = [
      ...linkResult.fields,
      ...linkTypes,
    ]
  }

  return defu(linkResult, overrides) as Field
}
