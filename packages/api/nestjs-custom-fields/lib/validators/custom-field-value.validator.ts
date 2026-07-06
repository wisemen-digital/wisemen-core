import { PlainDate, Timestamp } from '@wisemen/datewise'
import { Currency, Monetary } from '@wisemen/monetary'
import { CustomFieldValueValidationError } from './custom-field-value-validation.error.js'
import { CustomFieldDefinitionFields } from '#src/custom-field-definition.js'
import { TextCustomFieldRules, TextArrayCustomFieldRules, NumberCustomFieldRules, DateCustomFieldRules, TimestampCustomFieldRules, MultiSelectCustomFieldRules, MonetaryCustomFieldRules } from '#src/custom-field-rules.js'
import { CustomFieldValue, CustomFieldSelectValue } from '#src/custom-field-value.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'
import { exhaustiveCheck } from '#src/exhaustive-check.js'

export function validateCustomFieldValues(
  definitions: CustomFieldDefinitionFields[],
  values: CustomFieldValue[]
): void {
  const definitionsByUuid = new Map<string, CustomFieldDefinitionFields>()

  for (const definition of definitions) {
    if (definitionsByUuid.has(definition.uuid)) {
      throw new CustomFieldValueValidationError(`Duplicate custom field definition ${definition.uuid}`)
    }

    definitionsByUuid.set(definition.uuid, definition)
  }

  const seenDefinitionUuids = new Set<string>()
  for (const value of values) {
    const definition = definitionsByUuid.get(value.definitionUuid)

    if (definition === undefined) {
      throw new CustomFieldValueValidationError(`Custom field definition ${value.definitionUuid} was not found`)
    }

    if (seenDefinitionUuids.has(value.definitionUuid)) {
      throw new CustomFieldValueValidationError(`Custom field value for definition ${value.definitionUuid} can only be provided once`)
    }

    seenDefinitionUuids.add(value.definitionUuid)
    validateCustomFieldValue(definition, value)
  }

  for (const definition of definitions) {
    if (definition.isRequired && !seenDefinitionUuids.has(definition.uuid)) {
      throw new CustomFieldValueValidationError(`Custom field definition ${definition.uuid} is required`)
    }
  }
}

export function validateCustomFieldValue(
  definition: CustomFieldDefinitionFields,
  value: CustomFieldValue
): void {
  if (value.definitionUuid !== definition.uuid) {
    throw new CustomFieldValueValidationError('Custom field value definitionUuid must match the definition uuid')
  }

  if (value.type !== definition.type) {
    throw new CustomFieldValueValidationError('Custom field value type must match the definition type')
  }

  if (definition.rules !== null && definition.rules.type !== definition.type) {
    throw new CustomFieldValueValidationError('Custom field rules must match the definition type')
  }

  switch (value.type) {
    case CustomFieldType.TEXT:
      validateTextValue(definition.rules as TextCustomFieldRules, value.value)
      return
    case CustomFieldType.TEXT_ARRAY:
      validateTextArrayValue(definition.rules as TextArrayCustomFieldRules, value.value)
      return
    case CustomFieldType.NUMBER:
      validateNumberValue(definition.rules as NumberCustomFieldRules, value.value)
      return
    case CustomFieldType.BOOLEAN:
      return
    case CustomFieldType.DATE:
      validateDateValue(definition.rules as DateCustomFieldRules, value.value)
      return
    case CustomFieldType.TIMESTAMP:
      validateTimestampValue(definition.rules as TimestampCustomFieldRules, value.value)
      return
    case CustomFieldType.SINGLE_SELECT:
      validateSingleSelectValue(definition, value.value)
      return
    case CustomFieldType.MULTI_SELECT:
      validateMultiSelectValue(
        definition,
        definition.rules as MultiSelectCustomFieldRules,
        value.value
      )
      return
    case CustomFieldType.MONETARY:
      validateMonetaryValue(
        definition.rules as MonetaryCustomFieldRules | null,
        value.value
      )
      return
    default:
      exhaustiveCheck(value)
  }
}

function validateTextValue(rules: TextCustomFieldRules, value: string): void {
  if (rules === null) {
    return
  }

  if (rules.minLength !== undefined && value.length < rules.minLength) {
    throw new CustomFieldValueValidationError('Text custom field value can not be shorter than minLength')
  }

  if (rules.maxLength !== undefined && value.length > rules.maxLength) {
    throw new CustomFieldValueValidationError('Text custom field value can not be longer than maxLength')
  }

  if (rules.regex !== undefined && !new RegExp(rules.regex).test(value)) {
    throw new CustomFieldValueValidationError('Text custom field value must match the configured regex')
  }
}

function validateNumberValue(rules: NumberCustomFieldRules, value: number): void {
  if (rules === null) {
    return
  }

  if (rules.min !== undefined && value < rules.min) {
    throw new CustomFieldValueValidationError('Number custom field value can not be lower than min')
  }

  if (rules.max !== undefined && value > rules.max) {
    throw new CustomFieldValueValidationError('Number custom field value can not be greater than max')
  }
}

function validateTextArrayValue(
  rules: TextArrayCustomFieldRules,
  value: string[]
): void {
  if (rules === null) {
    return
  }

  if (rules.minItems !== undefined && value.length < rules.minItems) {
    throw new CustomFieldValueValidationError('Text array custom field value can not contain fewer than minItems')
  }

  if (rules.maxItems !== undefined && value.length > rules.maxItems) {
    throw new CustomFieldValueValidationError('Text array custom field value can not contain more than maxItems')
  }
}

function validateDateValue(rules: DateCustomFieldRules, value: PlainDate): void {
  if (rules === null) {
    return
  }

  if (rules.minDate !== undefined && value.isBefore(rules.minDate)) {
    throw new CustomFieldValueValidationError('Date custom field value can not be before minDate')
  }

  if (rules.maxDate !== undefined && value.isAfter(rules.maxDate)) {
    throw new CustomFieldValueValidationError('Date custom field value can not be after maxDate')
  }
}

function validateTimestampValue(
  rules: TimestampCustomFieldRules,
  value: Timestamp
): void {
  if (rules === null) {
    return
  }

  if (rules.minDate !== undefined && value.isBefore(rules.minDate)) {
    throw new CustomFieldValueValidationError('Timestamp custom field value can not be before minDate')
  }

  if (rules.maxDate !== undefined && value.isAfter(rules.maxDate)) {
    throw new CustomFieldValueValidationError('Timestamp custom field value can not be after maxDate')
  }
}

function validateSingleSelectValue(
  definition: Pick<CustomFieldDefinitionFields, 'choices'>,
  value: string | number
): void {
  const choices = assertChoicesDefined(definition)
  if (!choices.some(choice => choice.value === value)) {
    throw new CustomFieldValueValidationError('Single select custom field value must be one of the defined choices')
  }
}

function validateMultiSelectValue(
  definition: Pick<CustomFieldDefinitionFields, 'choices'>,
  rules: MultiSelectCustomFieldRules | null,
  value: CustomFieldSelectValue[]
): void {
  const choices = assertChoicesDefined(definition)

  for (const selectedValue of value) {
    if (!choices.some(choice => choice.value === selectedValue)) {
      throw new CustomFieldValueValidationError('Multi select custom field value must only contain defined choices')
    }
  }

  if (new Set(value).size !== value.length) {
    throw new CustomFieldValueValidationError('Multi select custom field value can not contain duplicate values')
  }

  if (rules === null) {
    return
  }

  if (rules.minSelections !== undefined && value.length < rules.minSelections) {
    throw new CustomFieldValueValidationError('Multi select custom field value can not contain fewer than minSelections')
  }

  if (rules.maxSelections !== undefined && value.length > rules.maxSelections) {
    throw new CustomFieldValueValidationError('Multi select custom field value can not contain more than maxSelections')
  }
}

function validateMonetaryValue(
  rules: MonetaryCustomFieldRules | null,
  value: Monetary<Currency>
): void {
  if (rules === null) {
    throw new CustomFieldValueValidationError('Monetary custom field definition must define rules')
  }

  if (rules.currencies !== undefined && !rules.currencies.includes(value.currency)) {
    throw new CustomFieldValueValidationError('Monetary custom field value must use an allowed currency')
  }

  if (value.precision !== rules.precision) {
    throw new CustomFieldValueValidationError('Monetary custom field value precision must match the configured precision')
  }

  if (rules.min !== undefined) {
    const min = new Monetary(rules.min, value.currency, rules.precision)

    if (value.isLessThan(min)) {
      throw new CustomFieldValueValidationError('Monetary custom field value can not be lower than min')
    }
  }

  if (rules.max !== undefined) {
    const max = new Monetary(rules.max, value.currency, rules.precision)
    if (value.isMoreThan(max)) {
      throw new CustomFieldValueValidationError('Monetary custom field value can not be greater than max')
    }
  }
}

function assertChoicesDefined(
  definition: Pick<CustomFieldDefinitionFields, 'choices'>
): NonNullable<CustomFieldDefinitionFields['choices']> {
  if (definition.choices === null) {
    throw new CustomFieldValueValidationError('Select custom field definition must define choices')
  }

  return definition.choices
}