import { describe, it } from 'node:test'
import { LocalizedString } from '@wisemen/localized-string'
import { customFieldDefinition } from '#src/factory/custom-field-definition.factory.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'
import { validateCustomFieldValue } from '#src/validators/custom-field-value.validator.js'
import { expect } from 'expect'

describe('boolean validateCustomFieldValue', () => {
  it('accepts a boolean custom field value', () => {
    const definition = customFieldDefinition(CustomFieldType.BOOLEAN, {
      tenantUuid: null,
      entityType: 'invoice',
      key: 'approved',
      label: new LocalizedString([{ locale: 'en', value: 'Approved' }]),
      description: null,
      isRequired: false
    })

    expect(() => validateCustomFieldValue(definition, {
      definitionUuid: definition.uuid,
      type: CustomFieldType.BOOLEAN,
      value: true
    })).not.toThrow()
  })
})
