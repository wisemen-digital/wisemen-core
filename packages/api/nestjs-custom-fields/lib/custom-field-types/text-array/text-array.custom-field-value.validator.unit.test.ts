import { describe, it } from 'node:test'
import { LocalizedString } from '@wisemen/localized-string'
import { customFieldDefinition } from '#src/factory/custom-field-definition.factory.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'
import { validateCustomFieldValue } from '#src/validators/custom-field-value.validator.js'
import { CustomFieldValueValidationError } from '#src/validators/custom-field-value-validation.error.js'
import { expect } from 'expect'

describe('text array validateCustomFieldValue', () => {
  it('rejects a text array custom field value with fewer than minItems', () => {
    const definition = customFieldDefinition(CustomFieldType.TEXT_ARRAY, {
      tenantUuid: null,
      entityType: 'invoice',
      key: 'tags',
      label: new LocalizedString([{ locale: 'en', value: 'Tags' }]),
      description: null,
      isRequired: false,
      rules: {
        minItems: 2
      }
    })

    expect(() => validateCustomFieldValue(definition, {
      definitionUuid: definition.uuid,
      type: CustomFieldType.TEXT_ARRAY,
      value: ['only-one']
    })).toThrow(new CustomFieldValueValidationError('Text array custom field value can not contain fewer than minItems'))
  })

  it('rejects a text array custom field value with more than maxItems', () => {
    const definition = customFieldDefinition(CustomFieldType.TEXT_ARRAY, {
      tenantUuid: null,
      entityType: 'invoice',
      key: 'tags',
      label: new LocalizedString([{ locale: 'en', value: 'Tags' }]),
      description: null,
      isRequired: false,
      rules: {
        maxItems: 1
      }
    })

    expect(() => validateCustomFieldValue(definition, {
      definitionUuid: definition.uuid,
      type: CustomFieldType.TEXT_ARRAY,
      value: ['first', 'second']
    })).toThrow(new CustomFieldValueValidationError('Text array custom field value can not contain more than maxItems'))
  })
})
