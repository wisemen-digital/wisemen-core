import { describe, it } from 'node:test'
import { expect } from 'expect'
import { LocalizedString } from '@wisemen/localized-string'
import { CustomFieldDefinitionError } from '#src/errors/custom-field-definition.error.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'
import { customFieldDefinition } from '#src/factory/custom-field-definition.factory.js'

describe('single select customFieldDefinition', () => {
  it('creates a single select custom field definition', () => {
    const definition = customFieldDefinition(CustomFieldType.SINGLE_SELECT, {
      tenantUuid: null,
      entityType: 'invoice',
      key: 'status',
      label: new LocalizedString([{ locale: 'en', value: 'Status' }]),
      description: null,
      isRequired: true,
      choices: [
        {
          value: 'first',
          label: new LocalizedString([{ locale: 'en', value: 'First' }]),
          order: 1
        },
        {
          value: 'second',
          label: new LocalizedString([{ locale: 'en', value: 'Second' }]),
          order: 2
        }
      ]
    })

    expect(definition.type).toBe(CustomFieldType.SINGLE_SELECT)
    expect(definition.choices).toEqual([
      {
        value: 'first',
        label: new LocalizedString([{ locale: 'en', value: 'First' }]),
        order: 1
      },
      {
        value: 'second',
        label: new LocalizedString([{ locale: 'en', value: 'Second' }]),
        order: 2
      }
    ])
    expect(definition.rules).toBeNull()
  })

  it('rejects a single select field without choices', () => {
    expect(() => customFieldDefinition(CustomFieldType.SINGLE_SELECT, {
      tenantUuid: null,
      entityType: 'invoice',
      key: 'status',
      label: new LocalizedString([{ locale: 'en', value: 'Status' }]),
      description: null,
      isRequired: false,
      choices: []
    })).toThrow(new CustomFieldDefinitionError('Select custom field must define at least one choice'))
  })

  it('rejects a select field with duplicate choice values', () => {
    expect(() => customFieldDefinition(CustomFieldType.SINGLE_SELECT, {
      tenantUuid: null,
      entityType: 'invoice',
      key: 'status',
      label: new LocalizedString([{ locale: 'en', value: 'Status' }]),
      description: null,
      isRequired: false,
      choices: [
        {
          value: 'first',
          label: new LocalizedString([{ locale: 'en', value: 'First' }]),
          order: 1
        },
        {
          value: 'first',
          label: new LocalizedString([{ locale: 'en', value: 'Duplicate first' }]),
          order: 2
        }
      ]
    })).toThrow(new CustomFieldDefinitionError('Custom field choice value must be unique'))
  })

  it('rejects a select field with duplicate choice orders', () => {
    expect(() => customFieldDefinition(CustomFieldType.SINGLE_SELECT, {
      tenantUuid: null,
      entityType: 'invoice',
      key: 'status',
      label: new LocalizedString([{ locale: 'en', value: 'Status' }]),
      description: null,
      isRequired: false,
      choices: [
        {
          value: 'first',
          label: new LocalizedString([{ locale: 'en', value: 'First' }]),
          order: 1
        },
        {
          value: 'second',
          label: new LocalizedString([{ locale: 'en', value: 'Second' }]),
          order: 1
        }
      ]
    })).toThrow(new CustomFieldDefinitionError('Custom field choice order must be unique'))
  })
})
