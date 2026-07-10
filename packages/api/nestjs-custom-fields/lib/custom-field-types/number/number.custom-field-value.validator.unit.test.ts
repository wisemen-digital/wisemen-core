import { describe, it } from 'node:test'
import { LocalizedString } from '@wisemen/localized-string'
import { customFieldDefinition } from '#src/factory/custom-field-definition.factory.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'
import { validateCustomFieldValue } from '#src/validators/custom-field-value.validator.js'
import { CustomFieldValueValidationError } from '#src/validators/custom-field-value-validation.error.js'
import { expect } from 'expect'

describe('number validateCustomFieldValue', () => {
  it('rejects a number custom field value lower than min', () => {
    const definition = customFieldDefinition(CustomFieldType.NUMBER, {
      tenantUuid: null,
      entityType: 'invoice',
      key: 'priority',
      label: new LocalizedString([{ locale: 'en', value: 'Priority' }]),
      description: null,
      isRequired: false,
      rules: {
        min: 2
      }
    })

    expect(() => validateCustomFieldValue(definition, {
      definitionUuid: definition.uuid,
      type: CustomFieldType.NUMBER,
      value: 1
    })).toThrow(new CustomFieldValueValidationError('Number custom field value can not be lower than min'))
  })

  it('rejects a number custom field value greater than max', () => {
    const definition = customFieldDefinition(CustomFieldType.NUMBER, {
      tenantUuid: null,
      entityType: 'invoice',
      key: 'priority',
      label: new LocalizedString([{ locale: 'en', value: 'Priority' }]),
      description: null,
      isRequired: false,
      rules: {
        max: 2
      }
    })

    expect(() => validateCustomFieldValue(definition, {
      definitionUuid: definition.uuid,
      type: CustomFieldType.NUMBER,
      value: 3
    })).toThrow(new CustomFieldValueValidationError('Number custom field value can not be greater than max'))
  })
})
