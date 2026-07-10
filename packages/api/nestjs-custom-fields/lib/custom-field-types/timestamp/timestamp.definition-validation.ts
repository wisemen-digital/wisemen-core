import { timestamp } from '@wisemen/datewise'
import { isDateString } from 'class-validator'
import type { ResolvedCustomFieldDefinitionFields } from '#src/custom-field-definition.js'
import { CustomFieldDefinitionError } from '#src/errors/custom-field-definition.error.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'

type TimestampCustomFieldDefinition = Extract<ResolvedCustomFieldDefinitionFields, { type: CustomFieldType.TIMESTAMP }>

export function validateTimestampCustomFieldDefinition(definition: TimestampCustomFieldDefinition): void {
  if (definition.choices !== null) {
    throw new CustomFieldDefinitionError('Only select custom fields can define choices')
  }

  const rules = definition.rules

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
