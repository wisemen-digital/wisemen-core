import { describe, it } from 'node:test'
import { expect } from 'expect'
import { LocalizedString } from '@wisemen/localized-string'
import { CustomFieldDefinitionError } from '#src/errors/custom-field-definition.error.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'
import { customFieldDefinition } from '#src/factory/custom-field-definition.factory.js'

describe('date customFieldDefinition', () => {
  it('creates a date custom field definition', () => {
    const definition = customFieldDefinition(CustomFieldType.DATE, {
      tenantUuid: null,
      entityType: 'invoice',
      key: 'due_date',
      label: new LocalizedString([{ locale: 'en', value: 'Due date' }]),
      description: null,
      isRequired: true,
      rules: {
        minDate: '2026-01-01',
        maxDate: '2026-12-31'
      }
    })

    expect(definition.type).toBe(CustomFieldType.DATE)
    expect(definition.choices).toBeNull()
    expect(definition.rules).toEqual({
      type: CustomFieldType.DATE,
      minDate: '2026-01-01',
      maxDate: '2026-12-31'
    })
  })

  it('rejects a date field whose minDate is after maxDate', () => {
    expect(() => customFieldDefinition(CustomFieldType.DATE, {
      tenantUuid: null,
      entityType: 'invoice',
      key: 'due_date',
      label: new LocalizedString([{ locale: 'en', value: 'Due date' }]),
      description: null,
      isRequired: false,
      rules: {
        minDate: '2026-12-31',
        maxDate: '2026-01-01'
      }
    })).toThrow(new CustomFieldDefinitionError('Date custom field minDate can not be after maxDate'))
  })

  it('rejects a date field with an invalid minDate', () => {
    expect(() => customFieldDefinition(CustomFieldType.DATE, {
      tenantUuid: null,
      entityType: 'invoice',
      key: 'due_date',
      label: new LocalizedString([{ locale: 'en', value: 'Due date' }]),
      description: null,
      isRequired: false,
      rules: {
        minDate: 'invalid-date'
      }
    })).toThrow(new CustomFieldDefinitionError('Date custom field minDate must be a valid date'))
  })

  it('rejects a date field whose minDate includes a time', () => {
    expect(() => customFieldDefinition(CustomFieldType.DATE, {
      tenantUuid: null,
      entityType: 'invoice',
      key: 'due_date',
      label: new LocalizedString([{ locale: 'en', value: 'Due date' }]),
      description: null,
      isRequired: false,
      rules: {
        minDate: '2026-01-01T23:00:00Z'
      }
    })).toThrow(new CustomFieldDefinitionError('Date custom field minDate must be a valid date'))
  })
})
