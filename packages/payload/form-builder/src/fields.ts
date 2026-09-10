import type {
  Block,
  Field,
} from 'payload'

import { FORM_FIELD_TYPES } from '#types.ts'

const fieldSettings: Field[] = [
  {
    name: 'name',
    admin: {
      description: 'The stable API key. Use lowercase camelCase, e.g. firstName.',
    },
    required: true,
    type: 'text',
  },
  {
    name: 'label',
    localized: true,
    required: true,
    type: 'text',
  },
  {
    name: 'helpText',
    localized: true,
    type: 'textarea',
  },
  {
    name: 'placeholder',
    localized: true,
    type: 'text',
  },
  {
    name: 'required',
    defaultValue: false,
    type: 'checkbox',
  },
  {
    name: 'width',
    defaultValue: 'full',
    options: [
      {
        label: 'Full width',
        value: 'full',
      },
      {
        label: 'Half width',
        value: 'half',
      },
    ],
    type: 'select',
  },
]

function standardField(type: (typeof FORM_FIELD_TYPES)[number]): Block {
  const fields: Field[] = [
    ...fieldSettings,
  ]

  if (type === 'checkbox') {
    fields.push({
      name: 'defaultValue',
      defaultValue: false,
      type: 'checkbox',
    })
  }
  else if (type === 'number') {
    fields.push({
      name: 'defaultValue',
      type: 'number',
    })
  }
  else {
    fields.push({
      name: 'defaultValue',
      localized: true,
      type: 'text',
    })
  }

  if (type === 'select' || type === 'radio') {
    fields.push({
      name: 'options',
      fields: [
        {
          name: 'label',
          localized: true,
          required: true,
          type: 'text',
        },
        {
          name: 'value',
          required: true,
          type: 'text',
        },
      ],
      minRows: 1,
      required: true,
      type: 'array',
    })
  }

  return {
    fields,
    interfaceName: `Form${type.charAt(0).toUpperCase()}${type.slice(1)}Field`,
    labels: {
      plural: `${type} fields`,
      singular: type,
    },
    slug: type,
  }
}

export const formFieldBlocks = FORM_FIELD_TYPES.map(standardField)
