import { LocalizedString } from '@wisemen/localized-string'
import { CustomFieldChoice } from '#src/custom-field-choice.js'
import { CustomFieldDefinitionFieldsByType, ResolvedCustomFieldDefinitionFields } from '#src/custom-field-definition.js'
import { CustomFieldDefinitionUuid, generateUuid } from '#src/custom-field-definition.uuid.js'
import { CustomFieldRules, CustomFieldRulesByType } from '#src/custom-field-rules.js'
import { CustomFieldChoicesModeByType, CustomFieldRulesModeByType } from '#src/custom-field-type-contract.js'
import { validateBooleanCustomFieldDefinition } from '#src/custom-field-types/boolean/boolean.definition-validation.js'
import { validateDateCustomFieldDefinition } from '#src/custom-field-types/date/date.definition-validation.js'
import { validateMonetaryCustomFieldDefinition } from '#src/custom-field-types/monetary/monetary.definition-validation.js'
import { validateMultiSelectCustomFieldDefinition } from '#src/custom-field-types/multi-select/multi-select.definition-validation.js'
import { validateNumberCustomFieldDefinition } from '#src/custom-field-types/number/number.definition-validation.js'
import { validateSingleSelectCustomFieldDefinition } from '#src/custom-field-types/single-select/single-select.definition-validation.js'
import { validateTextArrayCustomFieldDefinition } from '#src/custom-field-types/text-array/text-array.definition-validation.js'
import { validateTextCustomFieldDefinition } from '#src/custom-field-types/text/text.definition-validation.js'
import { validateTimestampCustomFieldDefinition } from '#src/custom-field-types/timestamp/timestamp.definition-validation.js'
import { exhaustiveCheck } from '#src/exhaustive-check.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'
import { CustomFieldDefinitionError } from '#src/errors/custom-field-definition.error.js'

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
      validateTextCustomFieldDefinition(definition)
      return
    case CustomFieldType.TEXT_ARRAY:
      validateTextArrayCustomFieldDefinition(definition)
      return
    case CustomFieldType.NUMBER:
      validateNumberCustomFieldDefinition(definition)
      return
    case CustomFieldType.BOOLEAN:
      validateBooleanCustomFieldDefinition(definition)
      return
    case CustomFieldType.DATE:
      validateDateCustomFieldDefinition(definition)
      return
    case CustomFieldType.TIMESTAMP:
      validateTimestampCustomFieldDefinition(definition)
      return
    case CustomFieldType.SINGLE_SELECT:
      validateSingleSelectCustomFieldDefinition(definition)
      return
    case CustomFieldType.MULTI_SELECT:
      validateMultiSelectCustomFieldDefinition(definition)
      return
    case CustomFieldType.MONETARY:
      validateMonetaryCustomFieldDefinition(definition)
      return
    default:
      exhaustiveCheck(definition)
  }
}
