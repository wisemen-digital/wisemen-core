import { describe, it } from 'node:test'
import { plainDate, timestamp } from '@wisemen/datewise'
import { LocalizedString } from '@wisemen/localized-string'
import { Currency, Monetary } from '@wisemen/monetary'
import { customFieldDefinition } from '#src/factory/custom-field-definition.factory.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'
import { validateCustomFieldValue, validateCustomFieldValues } from '#src/validators/custom-field-value.validator.js'
import { CustomFieldDefinitionFields } from '#src/custom-field-definition.js'
import { generateUuid, CustomFieldDefinitionUuid } from '#src/custom-field-definition.uuid.js'
import { CustomFieldValueValidationError } from '#src/validators/custom-field-value-validation.error.js'
import { expect } from 'expect'

describe('validateCustomFieldValues', () => {
  it('accepts valid custom field values', () => {
    const textDefinition = customFieldDefinition(CustomFieldType.TEXT, {
      tenantUuid: null,
      entityType: 'invoice',
      key: 'notes',
      label: new LocalizedString([{ locale: 'en', value: 'Notes' }]),
      description: null,
      isRequired: true,
      rules: {
        minLength: 2
      }
    })

    const singleSelectDefinition = customFieldDefinition(CustomFieldType.SINGLE_SELECT, {
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

    expect(() => validateCustomFieldValues(
      [textDefinition, singleSelectDefinition],
      [
        {
          definitionUuid: textDefinition.uuid,
          type: CustomFieldType.TEXT,
          value: 'ok'
        },
        {
          definitionUuid: singleSelectDefinition.uuid,
          type: CustomFieldType.SINGLE_SELECT,
          value: 'draft'
        }
      ]
    )).not.toThrow()
  })

  it('rejects duplicate custom field definitions', () => {
    const textDefinition = customFieldDefinition(CustomFieldType.TEXT, {
      tenantUuid: null,
      entityType: 'invoice',
      key: 'notes',
      label: new LocalizedString([{ locale: 'en', value: 'Notes' }]),
      description: null,
      isRequired: false
    })

    expect(() => validateCustomFieldValues(
      [textDefinition, textDefinition],
      []
    )).toThrow(new CustomFieldValueValidationError(`Duplicate custom field definition ${textDefinition.uuid}`))
  })

  it('rejects a value whose definition was not provided', () => {
    const textDefinition = customFieldDefinition(CustomFieldType.TEXT, {
      tenantUuid: null,
      entityType: 'invoice',
      key: 'notes',
      label: new LocalizedString([{ locale: 'en', value: 'Notes' }]),
      description: null,
      isRequired: false
    })

    const missingDefinitionUuid = generateUuid<CustomFieldDefinitionUuid>()

    expect(() => validateCustomFieldValues(
      [textDefinition],
      [
        {
          definitionUuid: missingDefinitionUuid,
          type: CustomFieldType.TEXT,
          value: 'hello'
        }
      ]
    )).toThrow(new CustomFieldValueValidationError(`Custom field definition ${missingDefinitionUuid} was not found`))
  })

  it('rejects duplicate values for the same definition', () => {
    const textDefinition = customFieldDefinition(CustomFieldType.TEXT, {
      tenantUuid: null,
      entityType: 'invoice',
      key: 'notes',
      label: new LocalizedString([{ locale: 'en', value: 'Notes' }]),
      description: null,
      isRequired: false
    })

    expect(() => validateCustomFieldValues(
      [textDefinition],
      [
        {
          definitionUuid: textDefinition.uuid,
          type: CustomFieldType.TEXT,
          value: 'first'
        },
        {
          definitionUuid: textDefinition.uuid,
          type: CustomFieldType.TEXT,
          value: 'second'
        }
      ]
    )).toThrow(new CustomFieldValueValidationError(`Custom field value for definition ${textDefinition.uuid} can only be provided once`))
  })

  it('rejects when a required custom field is missing', () => {
    const textDefinition = customFieldDefinition(CustomFieldType.TEXT, {
      tenantUuid: null,
      entityType: 'invoice',
      key: 'notes',
      label: new LocalizedString([{ locale: 'en', value: 'Notes' }]),
      description: null,
      isRequired: true
    })

    expect(() => validateCustomFieldValues(
      [textDefinition],
      []
    )).toThrow(new CustomFieldValueValidationError(`Custom field definition ${textDefinition.uuid} is required`))
  })
})

describe('validateCustomFieldValue', () => {
  it('accepts a boolean custom field value', () => {
    const definition = customFieldDefinition(CustomFieldType.BOOLEAN, {
      tenantUuid: null,
      entityType: 'invoice',
      key: 'approved',
      label: new LocalizedString([{ locale: 'en', value: 'Approved' }]),
      description: null,
      isRequired: false
    })

    expect(() => validateCustomFieldValue(definition, {
      definitionUuid: definition.uuid,
      type: CustomFieldType.BOOLEAN,
      value: true
    })).not.toThrow()
  })

  it('rejects when definitionUuid does not match the definition', () => {
    const definition = customFieldDefinition(CustomFieldType.TEXT, {
      tenantUuid: null,
      entityType: 'invoice',
      key: 'notes',
      label: new LocalizedString([{ locale: 'en', value: 'Notes' }]),
      description: null,
      isRequired: false
    })

    expect(() => validateCustomFieldValue(definition, {
      definitionUuid: generateUuid(),
      type: CustomFieldType.TEXT,
      value: 'hello'
    })).toThrow(new CustomFieldValueValidationError('Custom field value definitionUuid must match the definition uuid'))
  })

  it('rejects when value type does not match the definition type', () => {
    const definition = customFieldDefinition(CustomFieldType.TEXT, {
      tenantUuid: null,
      entityType: 'invoice',
      key: 'notes',
      label: new LocalizedString([{ locale: 'en', value: 'Notes' }]),
      description: null,
      isRequired: false
    })

    expect(() => validateCustomFieldValue(definition, {
      definitionUuid: definition.uuid,
      type: CustomFieldType.NUMBER,
      value: 1
    })).toThrow(new CustomFieldValueValidationError('Custom field value type must match the definition type'))
  })

  it('rejects when the rules type does not match the definition type', () => {
    const definition: CustomFieldDefinitionFields = {
      ...customFieldDefinition(CustomFieldType.TEXT, {
        tenantUuid: null,
        entityType: 'invoice',
        key: 'notes',
        label: new LocalizedString([{ locale: 'en', value: 'Notes' }]),
        description: null,
        isRequired: false
      }),
      rules: {
        type: CustomFieldType.NUMBER,
        min: 1
      }
    }

    expect(() => validateCustomFieldValue(definition, {
      definitionUuid: definition.uuid,
      type: CustomFieldType.TEXT,
      value: 'hello'
    })).toThrow(new CustomFieldValueValidationError('Custom field rules must match the definition type'))
  })

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

  it('rejects a timestamp custom field value before minDate', () => {
    const definition = customFieldDefinition(CustomFieldType.TIMESTAMP, {
      tenantUuid: null,
      entityType: 'invoice',
      key: 'sent_at',
      label: new LocalizedString([{ locale: 'en', value: 'Sent at' }]),
      description: null,
      isRequired: false,
      rules: {
        minDate: '2026-01-10T00:00:00.000Z'
      }
    })

    expect(() => validateCustomFieldValue(definition, {
      definitionUuid: definition.uuid,
      type: CustomFieldType.TIMESTAMP,
      value: timestamp('2026-01-01T00:00:00.000Z')
    })).toThrow(new CustomFieldValueValidationError('Timestamp custom field value can not be before minDate'))
  })

  it('rejects a timestamp custom field value after maxDate', () => {
    const definition = customFieldDefinition(CustomFieldType.TIMESTAMP, {
      tenantUuid: null,
      entityType: 'invoice',
      key: 'sent_at',
      label: new LocalizedString([{ locale: 'en', value: 'Sent at' }]),
      description: null,
      isRequired: false,
      rules: {
        maxDate: '2026-01-10T00:00:00.000Z'
      }
    })

    expect(() => validateCustomFieldValue(definition, {
      definitionUuid: definition.uuid,
      type: CustomFieldType.TIMESTAMP,
      value: timestamp('2026-01-11T00:00:00.000Z')
    })).toThrow(new CustomFieldValueValidationError('Timestamp custom field value can not be after maxDate'))
  })

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
    const definition: CustomFieldDefinitionFields = {
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
    const definition: CustomFieldDefinitionFields = {
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
