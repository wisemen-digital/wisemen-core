import { describe, it } from 'node:test'
import { expect } from 'expect'
import { LocalizedString } from '@wisemen/localized-string'
import { Currency } from '@wisemen/monetary'
import { generateUuid } from '#src/custom-field-definition.uuid.js'
import { customFieldDefinition } from '#src/factory/custom-field-definition.factory.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'
import { CustomFieldDefinitionError } from '#src/errors/custom-field-definition.error.js'

describe('customFieldDefinition', () => {
  it('creates a text custom field definition', () => {
    const tenantUuid = generateUuid()
    const definition = customFieldDefinition(CustomFieldType.TEXT, {
      tenantUuid,
      entityType: 'invoice',
      key: 'notes',
      label: new LocalizedString([{ locale: 'en', value: 'Notes' }]),
      description: new LocalizedString([{ locale: 'en', value: 'Invoice notes' }]),
      isRequired: true,
      rules: {
        minLength: 2,
        maxLength: 50,
        regex: '^[a-zA-Z ]+$'
      }
    })

    expect(definition.type).toBe(CustomFieldType.TEXT)
    expect(definition.tenantUuid).toBe(tenantUuid)
    expect(definition.choices).toBeNull()
    expect(definition.rules).toEqual({
      type: CustomFieldType.TEXT,
      minLength: 2,
      maxLength: 50,
      regex: '^[a-zA-Z ]+$'
    })
  })

  it('creates a text array custom field definition', () => {
    const definition = customFieldDefinition(CustomFieldType.TEXT_ARRAY, {
      tenantUuid: null,
      entityType: 'invoice',
      key: 'tags',
      label: new LocalizedString([{ locale: 'en', value: 'Tags' }]),
      description: null,
      isRequired: false,
      rules: {
        minItems: 1,
        maxItems: 3
      }
    })

    expect(definition.type).toBe(CustomFieldType.TEXT_ARRAY)
    expect(definition.tenantUuid).toBeNull()
    expect(definition.choices).toBeNull()
    expect(definition.rules).toEqual({
      type: CustomFieldType.TEXT_ARRAY,
      minItems: 1,
      maxItems: 3
    })
  })

  it('creates a number custom field definition', () => {
    const definition = customFieldDefinition(CustomFieldType.NUMBER, {
      tenantUuid: null,
      entityType: 'invoice',
      key: 'priority',
      label: new LocalizedString([{ locale: 'en', value: 'Priority' }]),
      description: null,
      isRequired: false,
      rules: {
        min: 1,
        max: 5
      }
    })

    expect(definition.type).toBe(CustomFieldType.NUMBER)
    expect(definition.choices).toBeNull()
    expect(definition.rules).toEqual({
      type: CustomFieldType.NUMBER,
      min: 1,
      max: 5
    })
  })

  it('creates a boolean custom field definition', () => {
    const definition = customFieldDefinition(CustomFieldType.BOOLEAN, {
      tenantUuid: null,
      entityType: 'invoice',
      key: 'approved',
      label: new LocalizedString([{ locale: 'en', value: 'Approved' }]),
      description: null,
      isRequired: false
    })

    expect(definition.type).toBe(CustomFieldType.BOOLEAN)
    expect(definition.choices).toBeNull()
    expect(definition.rules).toBeNull()
  })

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

  it('creates a timestamp custom field definition', () => {
    const definition = customFieldDefinition(CustomFieldType.TIMESTAMP, {
      tenantUuid: null,
      entityType: 'invoice',
      key: 'sent_at',
      label: new LocalizedString([{ locale: 'en', value: 'Sent at' }]),
      description: null,
      isRequired: false,
      rules: {
        minDate: '2026-01-01T00:00:00.000Z',
        maxDate: '2026-12-31T23:59:59.999Z'
      }
    })

    expect(definition.type).toBe(CustomFieldType.TIMESTAMP)
    expect(definition.choices).toBeNull()
    expect(definition.rules).toEqual({
      type: CustomFieldType.TIMESTAMP,
      minDate: '2026-01-01T00:00:00.000Z',
      maxDate: '2026-12-31T23:59:59.999Z'
    })
  })

  it('creates a single select custom field definition', () => {
    const definition = customFieldDefinition(CustomFieldType.SINGLE_SELECT, {
      tenantUuid: null,
      entityType: 'invoice',
      key: 'status',
      label: new LocalizedString([{ locale: 'en', value: 'Status' }]),
      description: null,
      isRequired: true,
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
      ]
    })

    expect(definition.type).toBe(CustomFieldType.SINGLE_SELECT)
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
    expect(definition.rules).toBeNull()
  })

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

  describe('rules', () => {
    it('rejects a custom field whose entityType is empty', () => {
      expect(() => customFieldDefinition(CustomFieldType.TEXT, {
        tenantUuid: null,
        entityType: '   ',
        key: 'notes',
        label: new LocalizedString([{ locale: 'en', value: 'Notes' }]),
        description: null,
        isRequired: false
      })).toThrow(new CustomFieldDefinitionError('Custom field entityType can not be empty'))
    })

    it('rejects a custom field whose key is empty', () => {
      expect(() => customFieldDefinition(CustomFieldType.TEXT, {
        tenantUuid: null,
        entityType: 'invoice',
        key: '   ',
        label: new LocalizedString([{ locale: 'en', value: 'Notes' }]),
        description: null,
        isRequired: false
      })).toThrow(new CustomFieldDefinitionError('Custom field key can not be empty'))
    })

    it('rejects a custom field whose label has no translations', () => {
      expect(() => customFieldDefinition(CustomFieldType.TEXT, {
        tenantUuid: null,
        entityType: 'invoice',
        key: 'notes',
        label: new LocalizedString([]),
        description: null,
        isRequired: false
      })).toThrow(new CustomFieldDefinitionError('Custom field label must contain at least one translation'))
    })

    it('rejects a custom field whose description has no translations', () => {
      expect(() => customFieldDefinition(CustomFieldType.TEXT, {
        tenantUuid: null,
        entityType: 'invoice',
        key: 'notes',
        label: new LocalizedString([{ locale: 'en', value: 'Notes' }]),
        description: new LocalizedString([]),
        isRequired: false
      })).toThrow(new CustomFieldDefinitionError('Custom field description must contain at least one translation'))
    })

    it('rejects a text field whose minLength is negative', () => {
      expect(() => customFieldDefinition(CustomFieldType.TEXT, {
        tenantUuid: null,
        entityType: 'invoice',
        key: 'notes',
        label: new LocalizedString([{ locale: 'en', value: 'Notes' }]),
        description: null,
        isRequired: false,
        rules: {
          minLength: -1
        }
      })).toThrow(new CustomFieldDefinitionError('Text custom field minLength can not be negative'))
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

    it('rejects a text field whose maxLength is negative', () => {
      expect(() => customFieldDefinition(CustomFieldType.TEXT, {
        tenantUuid: null,
        entityType: 'invoice',
        key: 'notes',
        label: new LocalizedString([{ locale: 'en', value: 'Notes' }]),
        description: null,
        isRequired: false,
        rules: {
          maxLength: -1
        }
      })).toThrow(new CustomFieldDefinitionError('Text custom field maxLength can not be negative'))
    })

    it('rejects a text field whose minLength exceeds maxLength', () => {
      expect(() => customFieldDefinition(CustomFieldType.TEXT, {
        tenantUuid: null,
        entityType: 'invoice',
        key: 'notes',
        label: new LocalizedString([{ locale: 'en', value: 'Notes' }]),
        description: null,
        isRequired: false,
        rules: {
          minLength: 10,
          maxLength: 5
        }
      })).toThrow(new CustomFieldDefinitionError('Text custom field minLength can not be greater than maxLength'))
    })

    it('rejects a text field whose regex is invalid', () => {
      expect(() => customFieldDefinition(CustomFieldType.TEXT, {
        tenantUuid: null,
        entityType: 'invoice',
        key: 'notes',
        label: new LocalizedString([{ locale: 'en', value: 'Notes' }]),
        description: null,
        isRequired: false,
        rules: {
          regex: '['
        }
      })).toThrow(new CustomFieldDefinitionError('Text custom field regex must be a valid regular expression'))
    })

    it('rejects a text array field whose minItems exceeds maxItems', () => {
      expect(() => customFieldDefinition(CustomFieldType.TEXT_ARRAY, {
        tenantUuid: null,
        entityType: 'invoice',
        key: 'tags',
        label: new LocalizedString([{ locale: 'en', value: 'Tags' }]),
        description: null,
        isRequired: false,
        rules: {
          minItems: 3,
          maxItems: 2
        }
      })).toThrow(new CustomFieldDefinitionError('Text array custom field minItems can not be greater than maxItems'))
    })

    it('rejects a text array field whose minItems is negative', () => {
      expect(() => customFieldDefinition(CustomFieldType.TEXT_ARRAY, {
        tenantUuid: null,
        entityType: 'invoice',
        key: 'tags',
        label: new LocalizedString([{ locale: 'en', value: 'Tags' }]),
        description: null,
        isRequired: false,
        rules: {
          minItems: -1
        }
      })).toThrow(new CustomFieldDefinitionError('Text array custom field minItems can not be negative'))
    })

    it('rejects a text array field whose maxItems is negative', () => {
      expect(() => customFieldDefinition(CustomFieldType.TEXT_ARRAY, {
        tenantUuid: null,
        entityType: 'invoice',
        key: 'tags',
        label: new LocalizedString([{ locale: 'en', value: 'Tags' }]),
        description: null,
        isRequired: false,
        rules: {
          maxItems: -1
        }
      })).toThrow(new CustomFieldDefinitionError('Text array custom field maxItems can not be negative'))
    })

    it('rejects a number field whose min exceeds max', () => {
      expect(() => customFieldDefinition(CustomFieldType.NUMBER, {
        tenantUuid: null,
        entityType: 'invoice',
        key: 'priority',
        label: new LocalizedString([{ locale: 'en', value: 'Priority' }]),
        description: null,
        isRequired: false,
        rules: {
          min: 10,
          max: 5
        }
      })).toThrow(new CustomFieldDefinitionError('Number custom field min can not be greater than max'))
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

    it('rejects a timestamp field with an invalid maxDate', () => {
      expect(() => customFieldDefinition(CustomFieldType.TIMESTAMP, {
        tenantUuid: null,
        entityType: 'invoice',
        key: 'sent_at',
        label: new LocalizedString([{ locale: 'en', value: 'Sent at' }]),
        description: null,
        isRequired: false,
        rules: {
          maxDate: 'invalid-date'
        }
      })).toThrow(new CustomFieldDefinitionError('Date custom field maxDate must be a valid date'))
    })

    it('rejects a timestamp field whose minDate is after maxDate', () => {
      expect(() => customFieldDefinition(CustomFieldType.TIMESTAMP, {
        tenantUuid: null,
        entityType: 'invoice',
        key: 'sent_at',
        label: new LocalizedString([{ locale: 'en', value: 'Sent at' }]),
        description: null,
        isRequired: false,
        rules: {
          minDate: '2026-12-31T23:59:59.999Z',
          maxDate: '2026-01-01T00:00:00.000Z'
        }
      })).toThrow(new CustomFieldDefinitionError('Date custom field minDate can not be after maxDate'))
    })

    it('rejects a single select field without choices', () => {
      expect(() => customFieldDefinition(CustomFieldType.SINGLE_SELECT, {
        tenantUuid: null,
        entityType: 'invoice',
        key: 'status',
        label: new LocalizedString([{ locale: 'en', value: 'Status' }]),
        description: null,
        isRequired: false,
        choices: []
      })).toThrow(new CustomFieldDefinitionError('Select custom field must define at least one choice'))
    })

    it('rejects a select field with duplicate choice values', () => {
      expect(() => customFieldDefinition(CustomFieldType.SINGLE_SELECT, {
        tenantUuid: null,
        entityType: 'invoice',
        key: 'status',
        label: new LocalizedString([{ locale: 'en', value: 'Status' }]),
        description: null,
        isRequired: false,
        choices: [
          {
            value: 'first',
            label: new LocalizedString([{ locale: 'en', value: 'First' }]),
            order: 1
          },
          {
            value: 'first',
            label: new LocalizedString([{ locale: 'en', value: 'Duplicate first' }]),
            order: 2
          }
        ]
      })).toThrow(new CustomFieldDefinitionError('Custom field choice value must be unique'))
    })

    it('rejects a select field with duplicate choice orders', () => {
      expect(() => customFieldDefinition(CustomFieldType.SINGLE_SELECT, {
        tenantUuid: null,
        entityType: 'invoice',
        key: 'status',
        label: new LocalizedString([{ locale: 'en', value: 'Status' }]),
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
            order: 1
          }
        ]
      })).toThrow(new CustomFieldDefinitionError('Custom field choice order must be unique'))
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
})
