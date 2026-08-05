import { describe, it } from 'node:test'
import { expect } from 'expect'
import { LocalizedString } from '@wisemen/localized-string'
import { CustomFieldDefinitionError } from '#src/errors/custom-field-definition.error.js'
import { CustomFieldDefinitionUuid, generateUuid } from '#src/custom-field-definition.uuid.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'
import { customFieldDefinition } from '#src/factory/custom-field-definition.factory.js'

describe('text customFieldDefinition', () => {
  it('creates a text custom field definition', () => {
    const tenantUuid = generateUuid<CustomFieldDefinitionUuid>()
    const definition = customFieldDefinition(CustomFieldType.TEXT, {
      tenantUuid,
      entityType: 'invoice',
      key: 'notes',
      label: new LocalizedString([{ locale: 'en', value: 'Notes' }]),
      description: new LocalizedString([{ locale: 'en', value: 'Invoice notes' }]),
      isRequired: true,
      rules: {
        minLength: 2,
        maxLength: 50,
        regex: '^[a-zA-Z ]+$'
      }
    })

    expect(definition.type).toBe(CustomFieldType.TEXT)
    expect(definition.tenantUuid).toBe(tenantUuid)
    expect(definition.choices).toBeNull()
    expect(definition.rules).toEqual({
      type: CustomFieldType.TEXT,
      minLength: 2,
      maxLength: 50,
      regex: '^[a-zA-Z ]+$'
    })
  })

  it('rejects a custom field whose entityType is empty', () => {
    expect(() => customFieldDefinition(CustomFieldType.TEXT, {
      tenantUuid: null,
      entityType: '   ',
      key: 'notes',
      label: new LocalizedString([{ locale: 'en', value: 'Notes' }]),
      description: null,
      isRequired: false
    })).toThrow(new CustomFieldDefinitionError('Custom field entityType can not be empty'))
  })

  it('rejects a custom field whose key is empty', () => {
    expect(() => customFieldDefinition(CustomFieldType.TEXT, {
      tenantUuid: null,
      entityType: 'invoice',
      key: '   ',
      label: new LocalizedString([{ locale: 'en', value: 'Notes' }]),
      description: null,
      isRequired: false
    })).toThrow(new CustomFieldDefinitionError('Custom field key can not be empty'))
  })

  it('rejects a custom field whose label has no translations', () => {
    expect(() => customFieldDefinition(CustomFieldType.TEXT, {
      tenantUuid: null,
      entityType: 'invoice',
      key: 'notes',
      label: new LocalizedString([]),
      description: null,
      isRequired: false
    })).toThrow(new CustomFieldDefinitionError('Custom field label must contain at least one translation'))
  })

  it('rejects a custom field whose description has no translations', () => {
    expect(() => customFieldDefinition(CustomFieldType.TEXT, {
      tenantUuid: null,
      entityType: 'invoice',
      key: 'notes',
      label: new LocalizedString([{ locale: 'en', value: 'Notes' }]),
      description: new LocalizedString([]),
      isRequired: false
    })).toThrow(new CustomFieldDefinitionError('Custom field description must contain at least one translation'))
  })

  it('rejects a text field whose minLength is negative', () => {
    expect(() => customFieldDefinition(CustomFieldType.TEXT, {
      tenantUuid: null,
      entityType: 'invoice',
      key: 'notes',
      label: new LocalizedString([{ locale: 'en', value: 'Notes' }]),
      description: null,
      isRequired: false,
      rules: {
        minLength: -1
      }
    })).toThrow(new CustomFieldDefinitionError('Text custom field minLength can not be negative'))
  })

  it('rejects a text field whose maxLength is negative', () => {
    expect(() => customFieldDefinition(CustomFieldType.TEXT, {
      tenantUuid: null,
      entityType: 'invoice',
      key: 'notes',
      label: new LocalizedString([{ locale: 'en', value: 'Notes' }]),
      description: null,
      isRequired: false,
      rules: {
        maxLength: -1
      }
    })).toThrow(new CustomFieldDefinitionError('Text custom field maxLength can not be negative'))
  })

  it('rejects a text field whose minLength exceeds maxLength', () => {
    expect(() => customFieldDefinition(CustomFieldType.TEXT, {
      tenantUuid: null,
      entityType: 'invoice',
      key: 'notes',
      label: new LocalizedString([{ locale: 'en', value: 'Notes' }]),
      description: null,
      isRequired: false,
      rules: {
        minLength: 10,
        maxLength: 5
      }
    })).toThrow(new CustomFieldDefinitionError('Text custom field minLength can not be greater than maxLength'))
  })

  it('rejects a text field whose regex is invalid', () => {
    expect(() => customFieldDefinition(CustomFieldType.TEXT, {
      tenantUuid: null,
      entityType: 'invoice',
      key: 'notes',
      label: new LocalizedString([{ locale: 'en', value: 'Notes' }]),
      description: null,
      isRequired: false,
      rules: {
        regex: '['
      }
    })).toThrow(new CustomFieldDefinitionError('Text custom field regex must be a valid regular expression'))
  })
})
