import type { CustomFieldChoice } from '#src/custom-field-choice.js'
import type { ResolvedCustomFieldDefinitionFields } from '#src/custom-field-definition.js'
import { CustomFieldDefinitionError } from '#src/errors/custom-field-definition.error.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'

type SingleSelectCustomFieldDefinition = Extract<ResolvedCustomFieldDefinitionFields, { type: CustomFieldType.SINGLE_SELECT }>

export function validateSingleSelectCustomFieldDefinition(definition: SingleSelectCustomFieldDefinition): void {
  if (definition.rules !== null) {
    throw new CustomFieldDefinitionError('Single select custom field can not define rules')
  }

  validateSelectChoices(definition.choices)
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
