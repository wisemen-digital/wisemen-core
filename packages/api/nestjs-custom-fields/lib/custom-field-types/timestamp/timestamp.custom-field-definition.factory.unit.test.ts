import { describe, it } from 'node:test'
import { expect } from 'expect'
import { LocalizedString } from '@wisemen/localized-string'
import { CustomFieldDefinitionError } from '#src/errors/custom-field-definition.error.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'
import { customFieldDefinition } from '#src/factory/custom-field-definition.factory.js'

describe('timestamp customFieldDefinition', () => {
  it('creates a timestamp custom field definition', () => {
    const definition = customFieldDefinition(CustomFieldType.TIMESTAMP, {
      tenantUuid: null,
      entityType: 'invoice',
      key: 'sent_at',
      label: new LocalizedString([{ locale: 'en', value: 'Sent at' }]),
      description: null,
      isRequired: false,
      rules: {
        minDate: '2026-01-01T00:00:00.000Z',
        maxDate: '2026-12-31T23:59:59.999Z'
      }
    })

    expect(definition.type).toBe(CustomFieldType.TIMESTAMP)
    expect(definition.choices).toBeNull()
    expect(definition.rules).toEqual({
      type: CustomFieldType.TIMESTAMP,
      minDate: '2026-01-01T00:00:00.000Z',
      maxDate: '2026-12-31T23:59:59.999Z'
    })
  })

  it('rejects a timestamp field with an invalid maxDate', () => {
    expect(() => customFieldDefinition(CustomFieldType.TIMESTAMP, {
      tenantUuid: null,
      entityType: 'invoice',
      key: 'sent_at',
      label: new LocalizedString([{ locale: 'en', value: 'Sent at' }]),
      description: null,
      isRequired: false,
      rules: {
        maxDate: 'invalid-date'
      }
    })).toThrow(new CustomFieldDefinitionError('Date custom field maxDate must be a valid date'))
  })

  it('rejects a timestamp field whose minDate omits a timezone', () => {
    expect(() => customFieldDefinition(CustomFieldType.TIMESTAMP, {
      tenantUuid: null,
      entityType: 'invoice',
      key: 'sent_at',
      label: new LocalizedString([{ locale: 'en', value: 'Sent at' }]),
      description: null,
      isRequired: false,
      rules: {
        minDate: '2026-01-01T09:00:00'
      }
    })).toThrow(new CustomFieldDefinitionError('Date custom field minDate must be a valid date'))
  })

  it('rejects a timestamp field whose minDate is after maxDate', () => {
    expect(() => customFieldDefinition(CustomFieldType.TIMESTAMP, {
      tenantUuid: null,
      entityType: 'invoice',
      key: 'sent_at',
      label: new LocalizedString([{ locale: 'en', value: 'Sent at' }]),
      description: null,
      isRequired: false,
      rules: {
        minDate: '2026-12-31T23:59:59.999Z',
        maxDate: '2026-01-01T00:00:00.000Z'
      }
    })).toThrow(new CustomFieldDefinitionError('Date custom field minDate can not be after maxDate'))
  })
})
