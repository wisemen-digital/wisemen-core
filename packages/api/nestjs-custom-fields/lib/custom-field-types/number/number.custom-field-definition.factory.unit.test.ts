import { describe, it } from 'node:test'
import { expect } from 'expect'
import { LocalizedString } from '@wisemen/localized-string'
import { CustomFieldDefinitionError } from '#src/errors/custom-field-definition.error.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'
import { customFieldDefinition } from '#src/factory/custom-field-definition.factory.js'

describe('number customFieldDefinition', () => {
  it('creates a number custom field definition', () => {
    const definition = customFieldDefinition(CustomFieldType.NUMBER, {
      tenantUuid: null,
      entityType: 'invoice',
      key: 'priority',
      label: new LocalizedString([{ locale: 'en', value: 'Priority' }]),
      description: null,
      isRequired: false,
      rules: {
        min: 1,
        max: 5
      }
    })

    expect(definition.type).toBe(CustomFieldType.NUMBER)
    expect(definition.choices).toBeNull()
    expect(definition.rules).toEqual({
      type: CustomFieldType.NUMBER,
      min: 1,
      max: 5
    })
  })

  it('rejects a number field whose min exceeds max', () => {
    expect(() => customFieldDefinition(CustomFieldType.NUMBER, {
      tenantUuid: null,
      entityType: 'invoice',
      key: 'priority',
      label: new LocalizedString([{ locale: 'en', value: 'Priority' }]),
      description: null,
      isRequired: false,
      rules: {
        min: 10,
        max: 5
      }
    })).toThrow(new CustomFieldDefinitionError('Number custom field min can not be greater than max'))
  })
})
