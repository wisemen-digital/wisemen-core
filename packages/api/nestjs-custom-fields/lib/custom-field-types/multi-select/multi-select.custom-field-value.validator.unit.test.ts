import { describe, it } from 'node:test'
import { LocalizedString } from '@wisemen/localized-string'
import { customFieldDefinition } from '#src/factory/custom-field-definition.factory.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'
import { validateCustomFieldValue } from '#src/validators/custom-field-value.validator.js'
import { CustomFieldValueValidationError } from '#src/validators/custom-field-value-validation.error.js'
import { expect } from 'expect'

describe('multi select validateCustomFieldValue', () => {
  it('rejects a multi select custom field value containing an undefined choice', () => {
    const definition = customFieldDefinition(CustomFieldType.MULTI_SELECT, {
      tenantUuid: null,
      entityType: 'invoice',
      key: 'labels',
      label: new LocalizedString([{ locale: 'en', value: 'Labels' }]),
      description: null,
      isRequired: false,
      choices: [
        {
          value: 'finance',
          label: new LocalizedString([{ locale: 'en', value: 'Finance' }]),
          order: 1
        }
      ]
    })

    expect(() => validateCustomFieldValue(definition, {
      definitionUuid: definition.uuid,
      type: CustomFieldType.MULTI_SELECT,
      value: ['finance', 'missing']
    })).toThrow(new CustomFieldValueValidationError('Multi select custom field value must only contain defined choices'))
  })

  it('rejects a multi select custom field value containing duplicate selections', () => {
    const definition = customFieldDefinition(CustomFieldType.MULTI_SELECT, {
      tenantUuid: null,
      entityType: 'invoice',
      key: 'labels',
      label: new LocalizedString([{ locale: 'en', value: 'Labels' }]),
      description: null,
      isRequired: false,
      choices: [
        {
          value: 'finance',
          label: new LocalizedString([{ locale: 'en', value: 'Finance' }]),
          order: 1
        },
        {
          value: 'priority',
          label: new LocalizedString([{ locale: 'en', value: 'Priority' }]),
          order: 2
        }
      ],
      rules: {
        minSelections: 2
      }
    })

    expect(() => validateCustomFieldValue(definition, {
      definitionUuid: definition.uuid,
      type: CustomFieldType.MULTI_SELECT,
      value: ['finance', 'finance']
    })).toThrow(new CustomFieldValueValidationError('Multi select custom field value can not contain duplicate values'))
  })

  it('rejects a multi select custom field value with fewer than minSelections', () => {
    const definition = customFieldDefinition(CustomFieldType.MULTI_SELECT, {
      tenantUuid: null,
      entityType: 'invoice',
      key: 'labels',
      label: new LocalizedString([{ locale: 'en', value: 'Labels' }]),
      description: null,
      isRequired: false,
      choices: [
        {
          value: 'finance',
          label: new LocalizedString([{ locale: 'en', value: 'Finance' }]),
          order: 1
        },
        {
          value: 'priority',
          label: new LocalizedString([{ locale: 'en', value: 'Priority' }]),
          order: 2
        }
      ],
      rules: {
        minSelections: 2
      }
    })

    expect(() => validateCustomFieldValue(definition, {
      definitionUuid: definition.uuid,
      type: CustomFieldType.MULTI_SELECT,
      value: ['finance']
    })).toThrow(new CustomFieldValueValidationError('Multi select custom field value can not contain fewer than minSelections'))
  })

  it('rejects a multi select custom field value with more than maxSelections', () => {
    const definition = customFieldDefinition(CustomFieldType.MULTI_SELECT, {
      tenantUuid: null,
      entityType: 'invoice',
      key: 'labels',
      label: new LocalizedString([{ locale: 'en', value: 'Labels' }]),
      description: null,
      isRequired: false,
      choices: [
        {
          value: 'finance',
          label: new LocalizedString([{ locale: 'en', value: 'Finance' }]),
          order: 1
        },
        {
          value: 'priority',
          label: new LocalizedString([{ locale: 'en', value: 'Priority' }]),
          order: 2
        }
      ],
      rules: {
        maxSelections: 1
      }
    })

    expect(() => validateCustomFieldValue(definition, {
      definitionUuid: definition.uuid,
      type: CustomFieldType.MULTI_SELECT,
      value: ['finance', 'priority']
    })).toThrow(new CustomFieldValueValidationError('Multi select custom field value can not contain more than maxSelections'))
  })
})
