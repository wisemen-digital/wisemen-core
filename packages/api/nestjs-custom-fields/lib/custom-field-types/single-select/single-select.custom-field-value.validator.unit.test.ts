import { describe, it } from 'node:test'
import { LocalizedString } from '@wisemen/localized-string'
import { customFieldDefinition } from '#src/factory/custom-field-definition.factory.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'
import { validateCustomFieldValue } from '#src/validators/custom-field-value.validator.js'
import { CustomFieldDefinitionFields } from '#src/custom-field-definition.js'
import { CustomFieldValueValidationError } from '#src/validators/custom-field-value-validation.error.js'
import { expect } from 'expect'

describe('single select validateCustomFieldValue', () => {
  it('rejects a single select custom field value outside the defined choices', () => {
    const definition = customFieldDefinition(CustomFieldType.SINGLE_SELECT, {
      tenantUuid: null,
      entityType: 'invoice',
      key: 'status',
      label: new LocalizedString([{ locale: 'en', value: 'Status' }]),
      description: null,
      isRequired: false,
      choices: [
        {
          value: 'draft',
          label: new LocalizedString([{ locale: 'en', value: 'Draft' }]),
          order: 1
        }
      ]
    })

    expect(() => validateCustomFieldValue(definition, {
      definitionUuid: definition.uuid,
      type: CustomFieldType.SINGLE_SELECT,
      value: 'sent'
    })).toThrow(new CustomFieldValueValidationError('Single select custom field value must be one of the defined choices'))
  })

  it('rejects a single select custom field definition without choices', () => {
    const definition: CustomFieldDefinitionFields = {
      ...customFieldDefinition(CustomFieldType.SINGLE_SELECT, {
        tenantUuid: null,
        entityType: 'invoice',
        key: 'status',
        label: new LocalizedString([{ locale: 'en', value: 'Status' }]),
        description: null,
        isRequired: false,
        choices: [
          {
            value: 'draft',
            label: new LocalizedString([{ locale: 'en', value: 'Draft' }]),
            order: 1
          }
        ]
      }),
      choices: null
    }

    expect(() => validateCustomFieldValue(definition, {
      definitionUuid: definition.uuid,
      type: CustomFieldType.SINGLE_SELECT,
      value: 'draft'
    })).toThrow(new CustomFieldValueValidationError('Select custom field definition must define choices'))
  })
})
