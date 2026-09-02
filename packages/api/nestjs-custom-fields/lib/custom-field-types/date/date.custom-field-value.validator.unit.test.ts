import { describe, it } from 'node:test'
import { plainDate } from '@wisemen/datewise'
import { LocalizedString } from '@wisemen/localized-string'
import { customFieldDefinition } from '#src/factory/custom-field-definition.factory.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'
import { validateCustomFieldValue } from '#src/validators/custom-field-value.validator.js'
import { CustomFieldValueValidationError } from '#src/validators/custom-field-value-validation.error.js'
import { expect } from 'expect'

describe('date validateCustomFieldValue', () => {
  it('rejects a date custom field value before minDate', () => {
    const definition = customFieldDefinition(CustomFieldType.DATE, {
      tenantUuid: null,
      entityType: 'invoice',
      key: 'due_date',
      label: new LocalizedString([{ locale: 'en', value: 'Due date' }]),
      description: null,
      isRequired: false,
      rules: {
        minDate: '2026-01-10'
      }
    })

    expect(() => validateCustomFieldValue(definition, {
      definitionUuid: definition.uuid,
      type: CustomFieldType.DATE,
      value: plainDate('2026-01-01')
    })).toThrow(new CustomFieldValueValidationError('Date custom field value can not be before minDate'))
  })

  it('rejects a date custom field value after maxDate', () => {
    const definition = customFieldDefinition(CustomFieldType.DATE, {
      tenantUuid: null,
      entityType: 'invoice',
      key: 'due_date',
      label: new LocalizedString([{ locale: 'en', value: 'Due date' }]),
      description: null,
      isRequired: false,
      rules: {
        maxDate: '2026-01-10'
      }
    })

    expect(() => validateCustomFieldValue(definition, {
      definitionUuid: definition.uuid,
      type: CustomFieldType.DATE,
      value: plainDate('2026-01-11')
    })).toThrow(new CustomFieldValueValidationError('Date custom field value can not be after maxDate'))
  })
})
