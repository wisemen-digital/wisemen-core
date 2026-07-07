import { CustomFieldValue } from '#src/custom-field-value.js'
import { validateBooleanCustomFieldValue } from '#src/custom-field-types/boolean/boolean.custom-field-value.validator.js'
import { validateDateCustomFieldValue } from '#src/custom-field-types/date/date.custom-field-value.validator.js'
import { validateMonetaryCustomFieldValue } from '#src/custom-field-types/monetary/monetary.custom-field-value.validator.js'
import { validateMultiSelectCustomFieldValue } from '#src/custom-field-types/multi-select/multi-select.custom-field-value.validator.js'
import { validateNumberCustomFieldValue } from '#src/custom-field-types/number/number.custom-field-value.validator.js'
import { validateSingleSelectCustomFieldValue } from '#src/custom-field-types/single-select/single-select.custom-field-value.validator.js'
import { validateTextArrayCustomFieldValue } from '#src/custom-field-types/text-array/text-array.custom-field-value.validator.js'
import { validateTextCustomFieldValue } from '#src/custom-field-types/text/text.custom-field-value.validator.js'
import { validateTimestampCustomFieldValue } from '#src/custom-field-types/timestamp/timestamp.custom-field-value.validator.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'
import { exhaustiveCheck } from '#src/exhaustive-check.js'
import { CustomFieldValueValidationError } from './custom-field-value-validation.error.js'
import { CustomFieldDefinitionData } from '#src/index.js'

export function validateCustomFieldValues(
  definitions: CustomFieldDefinitionData[],
  values: CustomFieldValue[]
): void {
  const definitionsByUuid = new Map<string, CustomFieldDefinitionData>()

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
  definition: CustomFieldDefinitionData,
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
      validateTextCustomFieldValue(definition as Extract<CustomFieldDefinitionData, { type: CustomFieldType.TEXT }>, value.value)
      return
    case CustomFieldType.TEXT_ARRAY:
      validateTextArrayCustomFieldValue(definition as Extract<CustomFieldDefinitionData, { type: CustomFieldType.TEXT_ARRAY }>, value.value)
      return
    case CustomFieldType.NUMBER:
      validateNumberCustomFieldValue(definition as Extract<CustomFieldDefinitionData, { type: CustomFieldType.NUMBER }>, value.value)
      return
    case CustomFieldType.BOOLEAN:
      validateBooleanCustomFieldValue()
      return
    case CustomFieldType.DATE:
      validateDateCustomFieldValue(definition as Extract<CustomFieldDefinitionData, { type: CustomFieldType.DATE }>, value.value)
      return
    case CustomFieldType.TIMESTAMP:
      validateTimestampCustomFieldValue(definition as Extract<CustomFieldDefinitionData, { type: CustomFieldType.TIMESTAMP }>, value.value)
      return
    case CustomFieldType.SINGLE_SELECT:
      validateSingleSelectCustomFieldValue(
        definition as Extract<CustomFieldDefinitionData, { type: CustomFieldType.SINGLE_SELECT }>,
        value.value
      )
      return
    case CustomFieldType.MULTI_SELECT:
      validateMultiSelectCustomFieldValue(
        definition as Extract<CustomFieldDefinitionData, { type: CustomFieldType.MULTI_SELECT }>,
        value.value
      )
      return
    case CustomFieldType.MONETARY:
      validateMonetaryCustomFieldValue(
        definition as Extract<CustomFieldDefinitionData, { type: CustomFieldType.MONETARY }>,
        value.value
      )
      return
    default:
      exhaustiveCheck(value)
  }
}
