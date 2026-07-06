import { describe, it } from 'node:test'
import { expect } from 'expect'
import { LocalizedString } from '@wisemen/localized-string'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'
import { customFieldDefinition } from '#src/factory/custom-field-definition.factory.js'

describe('boolean customFieldDefinition', () => {
  it('creates a boolean custom field definition', () => {
    const definition = customFieldDefinition(CustomFieldType.BOOLEAN, {
      tenantUuid: null,
      entityType: 'invoice',
      key: 'approved',
      label: new LocalizedString([{ locale: 'en', value: 'Approved' }]),
      description: null,
      isRequired: false
    })

    expect(definition.type).toBe(CustomFieldType.BOOLEAN)
    expect(definition.choices).toBeNull()
    expect(definition.rules).toBeNull()
  })
})
