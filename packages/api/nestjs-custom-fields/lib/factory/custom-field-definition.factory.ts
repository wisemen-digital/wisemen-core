import { isDateString } from 'class-validator'
import { LocalizedString } from '@wisemen/localized-string'
import { CustomFieldDefinitionUuid, generateUuid } from '#src/custom-field-definition.uuid.js'
import { exhaustiveCheck } from '#src/exhaustive-check.js'
import { CustomFieldChoice } from '#src/custom-field-choice.js'
import { CustomFieldDefinitionFieldsByType, ResolvedCustomFieldDefinitionFields } from '#src/custom-field-definition.js'
import { CustomFieldRulesModeByType, CustomFieldChoicesModeByType } from '#src/custom-field-type-contract.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'
import { CustomFieldDefinitionError } from '#src/errors/custom-field-definition.error.js'
import { plainDate, timestamp } from '@wisemen/datewise'
import { CustomFieldRulesByType, CustomFieldRules, DateCustomFieldRules, TimestampCustomFieldRules, TextCustomFieldRules, TextArrayCustomFieldRules, NumberCustomFieldRules, MultiSelectCustomFieldRules, MonetaryCustomFieldRules } from '#src/custom-field-rules.js'

type NullIfEmpty<T> = keyof T extends never ? null : T | null

type CustomFieldRulesConfigByType<T extends CustomFieldType> = T extends RequiredRulesCustomField
  ? Omit<CustomFieldRulesByType<T>, 'type'>
  : NullIfEmpty<Omit<CustomFieldRulesByType<T>, 'type'>>

type CustomFieldRulesInput = CustomFieldRulesConfigByType<CustomFieldType> | undefined

export type RequiredRulesCustomField = {
  [T in CustomFieldType]: CustomFieldRulesModeByType<T> extends 'required' ? T : never
}[CustomFieldType]

export type NoRulesCustomField = {
  [T in CustomFieldType]: CustomFieldRulesModeByType<T> extends 'none' ? T : never
}[CustomFieldType]

export type OptionalRulesCustomField = Exclude<CustomFieldType, RequiredRulesCustomField | NoRulesCustomField>

export type SelectCustomFieldType = {
  [T in CustomFieldType]: CustomFieldChoicesModeByType<T> extends 'required' ? T : never
}[CustomFieldType]

export type CustomFieldDefinitionMetadataFields = {
  tenantUuid: string | null
  entityType: string
  key: string
  label: LocalizedString
  description: LocalizedString | null
  isRequired: boolean
}

export type CustomFieldDefinitionDraft<T extends CustomFieldType = CustomFieldType> = CustomFieldDefinitionFieldsByType<T>

type BaseCustomFieldInput<TType extends CustomFieldType> = CustomFieldDefinitionMetadataFields & { type: TType }

type RulesInput<TType extends CustomFieldType>
  = TType extends RequiredRulesCustomField
  ? { rules: CustomFieldRulesConfigByType<TType> }
  : TType extends OptionalRulesCustomField
  ? { rules?: CustomFieldRulesConfigByType<TType> }
  : TType extends NoRulesCustomField
  ? Record<never, never>
  : never

type SelectChoicesConfig<TType extends CustomFieldType> = TType extends SelectCustomFieldType
  ? { choices: CustomFieldChoice[] }
  : Record<never, never>

export type CustomFieldDefinitionInput<TType extends CustomFieldType = CustomFieldType>
  = TType extends CustomFieldType
  ? BaseCustomFieldInput<TType> & RulesInput<TType> & SelectChoicesConfig<TType>
  : never

export function customFieldDefinition<T extends CustomFieldType>(
  type: T,
  definition: Omit<CustomFieldDefinitionInput<T>, 'type'>
): CustomFieldDefinitionDraft<T> {
  return normalizeCustomFieldDefinition(withCustomFieldType(type, definition))
}

function withCustomFieldType<T extends CustomFieldType>(
  type: T,
  definition: Omit<CustomFieldDefinitionInput<T>, 'type'>
): CustomFieldDefinitionInput<T> {
  return {
    ...definition,
    type
  } as CustomFieldDefinitionInput<T>
}

function normalizeCustomFieldDefinition<T extends CustomFieldType>(
  definition: CustomFieldDefinitionInput<T>
): CustomFieldDefinitionDraft<T>
function normalizeCustomFieldDefinition(
  definition: CustomFieldDefinitionInput
): ResolvedCustomFieldDefinitionFields {
  switch (definition.type) {
    case CustomFieldType.TEXT:
    case CustomFieldType.TEXT_ARRAY:
    case CustomFieldType.NUMBER:
    case CustomFieldType.BOOLEAN:
    case CustomFieldType.DATE:
    case CustomFieldType.TIMESTAMP:
    case CustomFieldType.MONETARY: {
      const customFieldDefinition = {
        uuid: generateUuid<CustomFieldDefinitionUuid>(),
        tenantUuid: definition.tenantUuid,
        entityType: definition.entityType,
        key: definition.key,
        label: definition.label,
        description: definition.description,
        type: definition.type,
        rules: normalizeRules(
          definition.type,
          'rules' in definition ? definition.rules : null
        ),
        isRequired: definition.isRequired,
        choices: null
      } as Exclude<ResolvedCustomFieldDefinitionFields, { choices: CustomFieldChoice[] }>

      validateCustomFieldDefinition(customFieldDefinition)

      return customFieldDefinition
    }
    case CustomFieldType.SINGLE_SELECT:
    case CustomFieldType.MULTI_SELECT: {
      const customFieldDefinition = {
        uuid: generateUuid<CustomFieldDefinitionUuid>(),
        tenantUuid: definition.tenantUuid,
        entityType: definition.entityType,
        key: definition.key,
        label: definition.label,
        description: definition.description,
        type: definition.type,
        rules: normalizeRules(
          definition.type,
          'rules' in definition ? definition.rules : null
        ),
        isRequired: definition.isRequired,
        choices: definition.choices
      } as Extract<ResolvedCustomFieldDefinitionFields, { choices: CustomFieldChoice[] }>

      validateCustomFieldDefinition(customFieldDefinition)

      return customFieldDefinition
    }
    default:
      return exhaustiveCheck(definition)
  }
}

function normalizeRules(
  type: CustomFieldType,
  rules: CustomFieldRulesInput
): CustomFieldRules | null {
  if (rules == null) {
    return null
  }

  return {
    type,
    ...rules
  } as CustomFieldRules
}

function validateCustomFieldDefinition(
  definition: ResolvedCustomFieldDefinitionFields
): void {
  if (definition.entityType.trim() === '') {
    throw new CustomFieldDefinitionError('Custom field entityType can not be empty')
  }

  if (definition.key.trim() === '') {
    throw new CustomFieldDefinitionError('Custom field key can not be empty')
  }

  if (definition.label.toJSON().length === 0) {
    throw new CustomFieldDefinitionError('Custom field label must contain at least one translation')
  }

  if (definition.description !== null && definition.description.toJSON().length === 0) {
    throw new CustomFieldDefinitionError('Custom field description must contain at least one translation')
  }

  if (definition.rules !== null && definition.rules.type !== definition.type) {
    throw new CustomFieldDefinitionError('Custom field rules must match the field type')
  }

  switch (definition.type) {
    case CustomFieldType.TEXT:
      validateNoChoices(definition)
      validateTextRules(definition.rules)
      return
    case CustomFieldType.TEXT_ARRAY:
      validateNoChoices(definition)
      validateTextArrayRules(definition.rules)
      return
    case CustomFieldType.NUMBER:
      validateNoChoices(definition)
      validateNumberRules(definition.rules)
      return
    case CustomFieldType.BOOLEAN:
      validateNoChoices(definition)
      return
    case CustomFieldType.DATE:
      validateNoChoices(definition)
      validateDateRules(definition.rules)
      return
    case CustomFieldType.TIMESTAMP:
      validateNoChoices(definition)
      validateTimestampRules(definition.rules)
      return
    case CustomFieldType.SINGLE_SELECT:
      validateSelectChoices(definition.choices)
      return
    case CustomFieldType.MULTI_SELECT:
      validateSelectChoices(definition.choices)
      validateMultiSelectRules(definition.rules, definition.choices.length)
      return
    case CustomFieldType.MONETARY:
      validateNoChoices(definition)
      validateMonetaryRules(definition.rules)
      return
    default:
      exhaustiveCheck(definition)
  }
}

function validateDateRules(
  rules: DateCustomFieldRules | null
): void {
  if (rules === null) {
    return
  }

  const isValid = (date: string): boolean => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return false
    }

    try {
      plainDate(date)
      return true
    } catch {
      return false
    }
  }

  if (rules.minDate !== undefined && !isValid(rules.minDate)) {
    throw new CustomFieldDefinitionError('Date custom field minDate must be a valid date')
  }

  if (rules.maxDate !== undefined && !isValid(rules.maxDate)) {
    throw new CustomFieldDefinitionError('Date custom field maxDate must be a valid date')
  }

  if (
    rules.minDate !== undefined
    && rules.maxDate !== undefined
    && plainDate(rules.minDate).isAfter(rules.maxDate)
  ) {
    throw new CustomFieldDefinitionError('Date custom field minDate can not be after maxDate')
  }
}

function validateTimestampRules(
  rules: TimestampCustomFieldRules | null
): void {
  if (rules === null) {
    return
  }

  const isValid = (date: string): boolean => {
    if (!isDateString(date, { strict: true })) {
      return false
    }

    if (!/(Z|[+-]\d{2}:\d{2})$/.test(date)) {
      return false
    }

    try {
      return timestamp(date).isValid()
    } catch {
      return false
    }
  }

  if (rules.minDate !== undefined && !isValid(rules.minDate)) {
    throw new CustomFieldDefinitionError('Date custom field minDate must be a valid date')
  }

  if (rules.maxDate !== undefined && !isValid(rules.maxDate)) {
    throw new CustomFieldDefinitionError('Date custom field maxDate must be a valid date')
  }

  if (
    rules.minDate !== undefined
    && rules.maxDate !== undefined
    && timestamp(rules.minDate).isAfter(rules.maxDate)
  ) {
    throw new CustomFieldDefinitionError('Date custom field minDate can not be after maxDate')
  }
}

function validateNoChoices(definition: { choices: CustomFieldChoice[] | null }): void {
  if (definition.choices !== null) {
    throw new CustomFieldDefinitionError('Only select custom fields can define choices')
  }
}

function validateTextRules(
  rules: TextCustomFieldRules | null
): void {
  if (rules === null) {
    return
  }

  if (rules.minLength !== undefined && rules.minLength < 0) {
    throw new CustomFieldDefinitionError('Text custom field minLength can not be negative')
  }

  if (rules.maxLength !== undefined && rules.maxLength < 0) {
    throw new CustomFieldDefinitionError('Text custom field maxLength can not be negative')
  }

  if (
    rules.minLength !== undefined
    && rules.maxLength !== undefined
    && rules.minLength > rules.maxLength
  ) {
    throw new CustomFieldDefinitionError('Text custom field minLength can not be greater than maxLength')
  }

  if (rules.regex !== undefined) {
    try {
      new RegExp(rules.regex)
    } catch {
      throw new CustomFieldDefinitionError('Text custom field regex must be a valid regular expression')
    }
  }
}

function validateTextArrayRules(
  rules: TextArrayCustomFieldRules | null
): void {
  if (rules === null) {
    return
  }

  if (rules.minItems !== undefined && rules.minItems < 0) {
    throw new CustomFieldDefinitionError('Text array custom field minItems can not be negative')
  }

  if (rules.maxItems !== undefined && rules.maxItems < 0) {
    throw new CustomFieldDefinitionError('Text array custom field maxItems can not be negative')
  }

  if (
    rules.minItems !== undefined
    && rules.maxItems !== undefined
    && rules.minItems > rules.maxItems
  ) {
    throw new CustomFieldDefinitionError('Text array custom field minItems can not be greater than maxItems')
  }
}

function validateNumberRules(
  rules: NumberCustomFieldRules | null
): void {
  if (rules === null) {
    return
  }

  if (
    rules.min !== undefined
    && rules.max !== undefined
    && rules.min > rules.max
  ) {
    throw new CustomFieldDefinitionError('Number custom field min can not be greater than max')
  }
}

function validateMultiSelectRules(
  rules: MultiSelectCustomFieldRules | null,
  choiceCount: number
): void {
  if (rules === null) {
    return
  }

  if (rules.minSelections !== undefined && rules.minSelections < 0) {
    throw new CustomFieldDefinitionError('Multi select custom field minSelections can not be negative')
  }

  if (rules.maxSelections !== undefined && rules.maxSelections < 0) {
    throw new CustomFieldDefinitionError('Multi select custom field maxSelections can not be negative')
  }

  if (
    rules.minSelections !== undefined
    && rules.maxSelections !== undefined
    && rules.minSelections > rules.maxSelections
  ) {
    throw new CustomFieldDefinitionError('Multi select custom field minSelections can not be greater than maxSelections')
  }

  if (
    rules.maxSelections !== undefined
    && rules.maxSelections > choiceCount
  ) {
    throw new CustomFieldDefinitionError('Multi select custom field maxSelections can not exceed the amount of choices')
  }

  if (
    rules.minSelections !== undefined
    && rules.minSelections > choiceCount
  ) {
    throw new CustomFieldDefinitionError('Multi select custom field minSelections can not exceed the amount of choices')
  }
}

function validateMonetaryRules(
  rules: MonetaryCustomFieldRules | null
): void {
  if (rules === null) {
    throw new CustomFieldDefinitionError('Monetary custom field rules are required')
  }

  if (rules.currencies !== undefined && rules.currencies.length === 0) {
    throw new CustomFieldDefinitionError('Monetary custom field must define at least one allowed currency')
  }

  if (rules.precision === undefined) {
    throw new CustomFieldDefinitionError('Monetary custom field precision is required')
  }

  if (rules.precision <= 0) {
    throw new CustomFieldDefinitionError('Monetary custom field precision must be greater than zero')
  }

  if (
    rules.min !== undefined
    && rules.max !== undefined
    && rules.min > rules.max
  ) {
    throw new CustomFieldDefinitionError('Monetary custom field min can not be greater than max')
  }
}

function validateSelectChoices(choices: CustomFieldChoice[]): void {
  if (choices.length === 0) {
    throw new CustomFieldDefinitionError('Select custom field must define at least one choice')
  }

  const choiceValues = new Set<string>()
  const choiceOrders = new Set<number>()

  for (const choice of choices) {
    if (choiceValues.has(choice.value)) {
      throw new CustomFieldDefinitionError('Custom field choice value must be unique')
    }

    if (choiceOrders.has(choice.order)) {
      throw new CustomFieldDefinitionError('Custom field choice order must be unique')
    }

    choiceValues.add(choice.value)
    choiceOrders.add(choice.order)
  }
}