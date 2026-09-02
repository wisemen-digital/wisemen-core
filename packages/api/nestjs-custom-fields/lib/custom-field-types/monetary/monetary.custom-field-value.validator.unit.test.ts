import { describe, it } from 'node:test'
import { LocalizedString } from '@wisemen/localized-string'
import { Currency, Monetary } from '@wisemen/monetary'
import { customFieldDefinition } from '#src/factory/custom-field-definition.factory.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'
import { validateCustomFieldValue } from '#src/validators/custom-field-value.validator.js'
import { CustomFieldDefinitionData } from '#src/custom-field-definition.js'
import { CustomFieldValueValidationError } from '#src/validators/custom-field-value-validation.error.js'
import { expect } from 'expect'

describe('monetary validateCustomFieldValue', () => {
  it('rejects a monetary custom field value with a disallowed currency', () => {
    const definition = customFieldDefinition(CustomFieldType.MONETARY, {
      tenantUuid: null,
      entityType: 'invoice',
      key: 'amount',
      label: new LocalizedString([{ locale: 'en', value: 'Amount' }]),
      description: null,
      isRequired: false,
      rules: {
        currencies: [Currency.EUR],
        precision: 2
      }
    })

    expect(() => validateCustomFieldValue(definition, {
      definitionUuid: definition.uuid,
      type: CustomFieldType.MONETARY,
      value: new Monetary(100, Currency.USD, 2)
    })).toThrow(new CustomFieldValueValidationError('Monetary custom field value must use an allowed currency'))
  })

  it('rejects a monetary custom field value with a mismatched precision', () => {
    const definition = customFieldDefinition(CustomFieldType.MONETARY, {
      tenantUuid: null,
      entityType: 'invoice',
      key: 'amount',
      label: new LocalizedString([{ locale: 'en', value: 'Amount' }]),
      description: null,
      isRequired: false,
      rules: {
        precision: 2
      }
    })

    expect(() => validateCustomFieldValue(definition, {
      definitionUuid: definition.uuid,
      type: CustomFieldType.MONETARY,
      value: new Monetary(100, Currency.EUR, 3)
    })).toThrow(new CustomFieldValueValidationError('Monetary custom field value precision must match the configured precision'))
  })

  it('rejects a monetary custom field definition without rules', () => {
    const definition: CustomFieldDefinitionData = {
      ...customFieldDefinition(CustomFieldType.MONETARY, {
        tenantUuid: null,
        entityType: 'invoice',
        key: 'amount',
        label: new LocalizedString([{ locale: 'en', value: 'Amount' }]),
        description: null,
        isRequired: false,
        rules: {
          precision: 2
        }
      }),
      rules: null
    }

    expect(() => validateCustomFieldValue(definition, {
      definitionUuid: definition.uuid,
      type: CustomFieldType.MONETARY,
      value: new Monetary(100, Currency.EUR, 2)
    })).toThrow(new CustomFieldValueValidationError('Monetary custom field definition must define rules'))
  })

  it('rejects a monetary custom field definition without precision', () => {
    const definition: CustomFieldDefinitionData = {
      ...customFieldDefinition(CustomFieldType.MONETARY, {
        tenantUuid: null,
        entityType: 'invoice',
        key: 'amount',
        label: new LocalizedString([{ locale: 'en', value: 'Amount' }]),
        description: null,
        isRequired: false,
        rules: {
          precision: 2
        }
      }),
      rules: {
        type: CustomFieldType.MONETARY
      } as never
    }

    expect(() => validateCustomFieldValue(definition, {
      definitionUuid: definition.uuid,
      type: CustomFieldType.MONETARY,
      value: new Monetary(100, Currency.EUR, 2)
    })).toThrow(new CustomFieldValueValidationError('Monetary custom field definition must define precision'))
  })

  it('rejects a monetary custom field value lower than min', () => {
    const definition = customFieldDefinition(CustomFieldType.MONETARY, {
      tenantUuid: null,
      entityType: 'invoice',
      key: 'amount',
      label: new LocalizedString([{ locale: 'en', value: 'Amount' }]),
      description: null,
      isRequired: false,
      rules: {
        precision: 2,
        min: 100
      }
    })

    expect(() => validateCustomFieldValue(definition, {
      definitionUuid: definition.uuid,
      type: CustomFieldType.MONETARY,
      value: new Monetary(99, Currency.EUR, 2)
    })).toThrow(new CustomFieldValueValidationError('Monetary custom field value can not be lower than min'))
  })

  it('rejects a monetary custom field value greater than max', () => {
    const definition = customFieldDefinition(CustomFieldType.MONETARY, {
      tenantUuid: null,
      entityType: 'invoice',
      key: 'amount',
      label: new LocalizedString([{ locale: 'en', value: 'Amount' }]),
      description: null,
      isRequired: false,
      rules: {
        precision: 2,
        max: 100
      }
    })

    expect(() => validateCustomFieldValue(definition, {
      definitionUuid: definition.uuid,
      type: CustomFieldType.MONETARY,
      value: new Monetary(101, Currency.EUR, 2)
    })).toThrow(new CustomFieldValueValidationError('Monetary custom field value can not be greater than max'))
  })
})
