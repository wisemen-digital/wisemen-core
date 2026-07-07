import { describe, it } from 'node:test'
import { timestamp } from '@wisemen/datewise'
import { LocalizedString } from '@wisemen/localized-string'
import { customFieldDefinition } from '#src/factory/custom-field-definition.factory.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'
import { validateCustomFieldValue } from '#src/validators/custom-field-value.validator.js'
import { CustomFieldValueValidationError } from '#src/validators/custom-field-value-validation.error.js'
import { expect } from 'expect'

describe('timestamp validateCustomFieldValue', () => {
  it('rejects a timestamp custom field value before minDate', () => {
    const definition = customFieldDefinition(CustomFieldType.TIMESTAMP, {
      tenantUuid: null,
      entityType: 'invoice',
      key: 'sent_at',
      label: new LocalizedString([{ locale: 'en', value: 'Sent at' }]),
      description: null,
      isRequired: false,
      rules: {
        minDate: '2026-01-10T00:00:00.000Z'
      }
    })

    expect(() => validateCustomFieldValue(definition, {
      definitionUuid: definition.uuid,
      type: CustomFieldType.TIMESTAMP,
      value: timestamp('2026-01-01T00:00:00.000Z')
    })).toThrow(new CustomFieldValueValidationError('Timestamp custom field value can not be before minDate'))
  })

  it('rejects a timestamp custom field value after maxDate', () => {
    const definition = customFieldDefinition(CustomFieldType.TIMESTAMP, {
      tenantUuid: null,
      entityType: 'invoice',
      key: 'sent_at',
      label: new LocalizedString([{ locale: 'en', value: 'Sent at' }]),
      description: null,
      isRequired: false,
      rules: {
        maxDate: '2026-01-10T00:00:00.000Z'
      }
    })

    expect(() => validateCustomFieldValue(definition, {
      definitionUuid: definition.uuid,
      type: CustomFieldType.TIMESTAMP,
      value: timestamp('2026-01-11T00:00:00.000Z')
    })).toThrow(new CustomFieldValueValidationError('Timestamp custom field value can not be after maxDate'))
  })
})
