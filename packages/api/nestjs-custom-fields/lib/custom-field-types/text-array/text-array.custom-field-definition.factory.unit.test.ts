import { describe, it } from 'node:test'
import { expect } from 'expect'
import { LocalizedString } from '@wisemen/localized-string'
import { CustomFieldDefinitionError } from '#src/errors/custom-field-definition.error.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'
import { customFieldDefinition } from '#src/factory/custom-field-definition.factory.js'

describe('text array customFieldDefinition', () => {
  it('creates a text array custom field definition', () => {
    const definition = customFieldDefinition(CustomFieldType.TEXT_ARRAY, {
      tenantUuid: null,
      entityType: 'invoice',
      key: 'tags',
      label: new LocalizedString([{ locale: 'en', value: 'Tags' }]),
      description: null,
      isRequired: false,
      rules: {
        minItems: 1,
        maxItems: 3
      }
    })

    expect(definition.type).toBe(CustomFieldType.TEXT_ARRAY)
    expect(definition.tenantUuid).toBeNull()
    expect(definition.choices).toBeNull()
    expect(definition.rules).toEqual({
      type: CustomFieldType.TEXT_ARRAY,
      minItems: 1,
      maxItems: 3
    })
  })

  it('rejects a text array field whose minItems exceeds maxItems', () => {
    expect(() => customFieldDefinition(CustomFieldType.TEXT_ARRAY, {
      tenantUuid: null,
      entityType: 'invoice',
      key: 'tags',
      label: new LocalizedString([{ locale: 'en', value: 'Tags' }]),
      description: null,
      isRequired: false,
      rules: {
        minItems: 3,
        maxItems: 2
      }
    })).toThrow(new CustomFieldDefinitionError('Text array custom field minItems can not be greater than maxItems'))
  })

  it('rejects a text array field whose minItems is negative', () => {
    expect(() => customFieldDefinition(CustomFieldType.TEXT_ARRAY, {
      tenantUuid: null,
      entityType: 'invoice',
      key: 'tags',
      label: new LocalizedString([{ locale: 'en', value: 'Tags' }]),
      description: null,
      isRequired: false,
      rules: {
        minItems: -1
      }
    })).toThrow(new CustomFieldDefinitionError('Text array custom field minItems can not be negative'))
  })

  it('rejects a text array field whose maxItems is negative', () => {
    expect(() => customFieldDefinition(CustomFieldType.TEXT_ARRAY, {
      tenantUuid: null,
      entityType: 'invoice',
      key: 'tags',
      label: new LocalizedString([{ locale: 'en', value: 'Tags' }]),
      description: null,
      isRequired: false,
      rules: {
        maxItems: -1
      }
    })).toThrow(new CustomFieldDefinitionError('Text array custom field maxItems can not be negative'))
  })
})
