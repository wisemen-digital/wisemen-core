import { describe, it } from 'node:test'
import { expect } from 'expect'
import { LocalizedString } from '@wisemen/localized-string'
import { Currency } from '@wisemen/monetary'
import { CustomFieldDefinitionError } from '#src/errors/custom-field-definition.error.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'
import { customFieldDefinition } from '#src/factory/custom-field-definition.factory.js'

describe('monetary customFieldDefinition', () => {
  it('creates a monetary custom field definition', () => {
    const definition = customFieldDefinition(CustomFieldType.MONETARY, {
      tenantUuid: null,
      entityType: 'invoice',
      key: 'amount',
      label: new LocalizedString([{ locale: 'en', value: 'Amount' }]),
      description: null,
      isRequired: true,
      rules: {
        currencies: [Currency.EUR],
        precision: 2,
        min: 10,
        max: 1000
      }
    })

    expect(definition.type).toBe(CustomFieldType.MONETARY)
    expect(definition.choices).toBeNull()
    expect(definition.rules).toEqual({
      type: CustomFieldType.MONETARY,
      currencies: [Currency.EUR],
      precision: 2,
      min: 10,
      max: 1000
    })
  })

  it('rejects a monetary field without rules', () => {
    expect(() => customFieldDefinition(CustomFieldType.MONETARY, {
      tenantUuid: null,
      entityType: 'invoice',
      key: 'amount',
      label: new LocalizedString([{ locale: 'en', value: 'Amount' }]),
      description: null,
      isRequired: false
    } as never)).toThrow(new CustomFieldDefinitionError('Monetary custom field rules are required'))
  })

  it('rejects a monetary field without allowed currencies when currencies are configured', () => {
    expect(() => customFieldDefinition(CustomFieldType.MONETARY, {
      tenantUuid: null,
      entityType: 'invoice',
      key: 'amount',
      label: new LocalizedString([{ locale: 'en', value: 'Amount' }]),
      description: null,
      isRequired: false,
      rules: {
        currencies: [],
        precision: 2
      }
    })).toThrow(new CustomFieldDefinitionError('Monetary custom field must define at least one allowed currency'))
  })

  it('rejects a monetary field whose precision is not greater than zero', () => {
    expect(() => customFieldDefinition(CustomFieldType.MONETARY, {
      tenantUuid: null,
      entityType: 'invoice',
      key: 'amount',
      label: new LocalizedString([{ locale: 'en', value: 'Amount' }]),
      description: null,
      isRequired: false,
      rules: {
        precision: 0
      }
    })).toThrow(new CustomFieldDefinitionError('Monetary custom field precision must be greater than zero'))
  })

  it('rejects a monetary field whose min exceeds max', () => {
    expect(() => customFieldDefinition(CustomFieldType.MONETARY, {
      tenantUuid: null,
      entityType: 'invoice',
      key: 'amount',
      label: new LocalizedString([{ locale: 'en', value: 'Amount' }]),
      description: null,
      isRequired: false,
      rules: {
        precision: 2,
        min: 1000,
        max: 10
      }
    })).toThrow(new CustomFieldDefinitionError('Monetary custom field min can not be greater than max'))
  })

  it('rejects a monetary field without precision', () => {
    expect(() => customFieldDefinition(CustomFieldType.MONETARY, {
      tenantUuid: null,
      entityType: 'invoice',
      key: 'amount',
      label: new LocalizedString([{ locale: 'en', value: 'Amount' }]),
      description: null,
      isRequired: false,
      rules: {} as never
    })).toThrow(new CustomFieldDefinitionError('Monetary custom field precision is required'))
  })
})
