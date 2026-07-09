import type { CustomFieldChoice } from '#src/custom-field-choice.js'
import type { ResolvedCustomFieldDefinitionFields } from '#src/custom-field-definition.js'
import { CustomFieldDefinitionError } from '#src/errors/custom-field-definition.error.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'

type MultiSelectCustomFieldDefinition = Extract<ResolvedCustomFieldDefinitionFields, { type: CustomFieldType.MULTI_SELECT }>

export function validateMultiSelectCustomFieldDefinition(definition: MultiSelectCustomFieldDefinition): void {
  validateSelectChoices(definition.choices)

  const rules = definition.rules

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
    && rules.maxSelections > definition.choices.length
  ) {
    throw new CustomFieldDefinitionError('Multi select custom field maxSelections can not exceed the amount of choices')
  }

  if (
    rules.minSelections !== undefined
    && rules.minSelections > definition.choices.length
  ) {
    throw new CustomFieldDefinitionError('Multi select custom field minSelections can not exceed the amount of choices')
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
