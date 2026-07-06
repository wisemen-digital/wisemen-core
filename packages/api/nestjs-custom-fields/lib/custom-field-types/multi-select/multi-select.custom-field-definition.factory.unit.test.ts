import { describe, it } from 'node:test'
import { expect } from 'expect'
import { LocalizedString } from '@wisemen/localized-string'
import { CustomFieldDefinitionError } from '#src/errors/custom-field-definition.error.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'
import { customFieldDefinition } from '#src/factory/custom-field-definition.factory.js'

describe('multi select customFieldDefinition', () => {
  it('creates a multi select custom field definition', () => {
    const definition = customFieldDefinition(CustomFieldType.MULTI_SELECT, {
      tenantUuid: null,
      entityType: 'invoice',
      key: 'labels',
      label: new LocalizedString([{ locale: 'en', value: 'Labels' }]),
      description: null,
      isRequired: false,
      choices: [
        {
          value: 'first',
          label: new LocalizedString([{ locale: 'en', value: 'First' }]),
          order: 1
        },
        {
          value: 'second',
          label: new LocalizedString([{ locale: 'en', value: 'Second' }]),
          order: 2
        }
      ],
      rules: {
        minSelections: 1,
        maxSelections: 2
      }
    })

    expect(definition.type).toBe(CustomFieldType.MULTI_SELECT)
    expect(definition.choices).toEqual([
      {
        value: 'first',
        label: new LocalizedString([{ locale: 'en', value: 'First' }]),
        order: 1
      },
      {
        value: 'second',
        label: new LocalizedString([{ locale: 'en', value: 'Second' }]),
        order: 2
      }
    ])
    expect(definition.rules).toEqual({
      type: CustomFieldType.MULTI_SELECT,
      minSelections: 1,
      maxSelections: 2
    })
  })

  it('rejects a multi select field whose minSelections is negative', () => {
    expect(() => customFieldDefinition(CustomFieldType.MULTI_SELECT, {
      tenantUuid: null,
      entityType: 'invoice',
      key: 'labels',
      label: new LocalizedString([{ locale: 'en', value: 'Labels' }]),
      description: null,
      isRequired: false,
      choices: [
        {
          value: 'first',
          label: new LocalizedString([{ locale: 'en', value: 'First' }]),
          order: 1
        }
      ],
      rules: {
        minSelections: -1
      }
    })).toThrow(new CustomFieldDefinitionError('Multi select custom field minSelections can not be negative'))
  })

  it('rejects a multi select field whose maxSelections is negative', () => {
    expect(() => customFieldDefinition(CustomFieldType.MULTI_SELECT, {
      tenantUuid: null,
      entityType: 'invoice',
      key: 'labels',
      label: new LocalizedString([{ locale: 'en', value: 'Labels' }]),
      description: null,
      isRequired: false,
      choices: [
        {
          value: 'first',
          label: new LocalizedString([{ locale: 'en', value: 'First' }]),
          order: 1
        }
      ],
      rules: {
        maxSelections: -1
      }
    })).toThrow(new CustomFieldDefinitionError('Multi select custom field maxSelections can not be negative'))
  })

  it('rejects a multi select field whose minSelections exceeds maxSelections', () => {
    expect(() => customFieldDefinition(CustomFieldType.MULTI_SELECT, {
      tenantUuid: null,
      entityType: 'invoice',
      key: 'labels',
      label: new LocalizedString([{ locale: 'en', value: 'Labels' }]),
      description: null,
      isRequired: false,
      choices: [
        {
          value: 'first',
          label: new LocalizedString([{ locale: 'en', value: 'First' }]),
          order: 1
        },
        {
          value: 'second',
          label: new LocalizedString([{ locale: 'en', value: 'Second' }]),
          order: 2
        }
      ],
      rules: {
        minSelections: 2,
        maxSelections: 1
      }
    })).toThrow(new CustomFieldDefinitionError('Multi select custom field minSelections can not be greater than maxSelections'))
  })

  it('rejects a multi select field whose minSelections exceeds the amount of choices', () => {
    expect(() => customFieldDefinition(CustomFieldType.MULTI_SELECT, {
      tenantUuid: null,
      entityType: 'invoice',
      key: 'labels',
      label: new LocalizedString([{ locale: 'en', value: 'Labels' }]),
      description: null,
      isRequired: false,
      choices: [
        {
          value: 'first',
          label: new LocalizedString([{ locale: 'en', value: 'First' }]),
          order: 1
        },
        {
          value: 'second',
          label: new LocalizedString([{ locale: 'en', value: 'Second' }]),
          order: 2
        }
      ],
      rules: {
        minSelections: 3
      }
    })).toThrow(new CustomFieldDefinitionError('Multi select custom field minSelections can not exceed the amount of choices'))
  })

  it('rejects a multi select field whose maxSelections exceeds the amount of choices', () => {
    expect(() => customFieldDefinition(CustomFieldType.MULTI_SELECT, {
      tenantUuid: null,
      entityType: 'invoice',
      key: 'labels',
      label: new LocalizedString([{ locale: 'en', value: 'Labels' }]),
      description: null,
      isRequired: false,
      choices: [
        {
          value: 'first',
          label: new LocalizedString([{ locale: 'en', value: 'First' }]),
          order: 1
        },
        {
          value: 'second',
          label: new LocalizedString([{ locale: 'en', value: 'Second' }]),
          order: 2
        }
      ],
      rules: {
        maxSelections: 3
      }
    })).toThrow(new CustomFieldDefinitionError('Multi select custom field maxSelections can not exceed the amount of choices'))
  })
})
