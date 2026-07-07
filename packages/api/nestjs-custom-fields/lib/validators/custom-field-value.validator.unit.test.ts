import { describe, it } from 'node:test'
import { LocalizedString } from '@wisemen/localized-string'
import { customFieldDefinition } from '#src/factory/custom-field-definition.factory.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'
import { validateCustomFieldValue, validateCustomFieldValues } from '#src/validators/custom-field-value.validator.js'
import { CustomFieldDefinitionData } from '#src/custom-field-definition.js'
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
    const definition: CustomFieldDefinitionData = {
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
})
