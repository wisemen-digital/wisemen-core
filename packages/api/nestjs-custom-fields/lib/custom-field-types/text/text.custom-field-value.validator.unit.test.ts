import { describe, it } from 'node:test'
import { LocalizedString } from '@wisemen/localized-string'
import { customFieldDefinition } from '#src/factory/custom-field-definition.factory.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'
import { validateCustomFieldValue } from '#src/validators/custom-field-value.validator.js'
import { CustomFieldValueValidationError } from '#src/validators/custom-field-value-validation.error.js'
import { expect } from 'expect'

describe('text validateCustomFieldValue', () => {
  it('rejects a text custom field value shorter than minLength', () => {
    const definition = customFieldDefinition(CustomFieldType.TEXT, {
      tenantUuid: null,
      entityType: 'invoice',
      key: 'notes',
      label: new LocalizedString([{ locale: 'en', value: 'Notes' }]),
      description: null,
      isRequired: false,
      rules: {
        minLength: 3
      }
    })

    expect(() => validateCustomFieldValue(definition, {
      definitionUuid: definition.uuid,
      type: CustomFieldType.TEXT,
      value: 'no'
    })).toThrow(new CustomFieldValueValidationError('Text custom field value can not be shorter than minLength'))
  })

  it('rejects a text custom field value longer than maxLength', () => {
    const definition = customFieldDefinition(CustomFieldType.TEXT, {
      tenantUuid: null,
      entityType: 'invoice',
      key: 'notes',
      label: new LocalizedString([{ locale: 'en', value: 'Notes' }]),
      description: null,
      isRequired: false,
      rules: {
        maxLength: 2
      }
    })

    expect(() => validateCustomFieldValue(definition, {
      definitionUuid: definition.uuid,
      type: CustomFieldType.TEXT,
      value: 'long'
    })).toThrow(new CustomFieldValueValidationError('Text custom field value can not be longer than maxLength'))
  })

  it('rejects a text custom field value that does not match the regex', () => {
    const definition = customFieldDefinition(CustomFieldType.TEXT, {
      tenantUuid: null,
      entityType: 'invoice',
      key: 'notes',
      label: new LocalizedString([{ locale: 'en', value: 'Notes' }]),
      description: null,
      isRequired: false,
      rules: {
        regex: '^[A-Z]+$'
      }
    })

    expect(() => validateCustomFieldValue(definition, {
      definitionUuid: definition.uuid,
      type: CustomFieldType.TEXT,
      value: 'lowercase'
    })).toThrow(new CustomFieldValueValidationError('Text custom field value must match the configured regex'))
  })
})
