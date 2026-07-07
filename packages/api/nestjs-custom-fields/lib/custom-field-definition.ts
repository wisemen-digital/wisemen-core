import { CustomFieldChoice } from '#src/custom-field-choice.js'
import { CustomFieldDefinitionUuid } from '#src/custom-field-definition.uuid.js'
import { CustomFieldRules, CustomFieldRulesByType } from '#src/custom-field-rules.js'
import { CustomFieldChoicesModeByType, CustomFieldRulesModeByType } from '#src/custom-field-type-contract.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'
import { LocalizedString } from '@wisemen/localized-string'

export interface CustomFieldDefinitionData {
  uuid: CustomFieldDefinitionUuid
  tenantUuid: string | null
  entityType: string
  key: string
  label: LocalizedString
  description: LocalizedString | null
  type: CustomFieldType
  isRequired: boolean
  choices: CustomFieldChoice[] | null
  rules: CustomFieldRules | null
}

type BaseCustomFieldDefinitionFields<T extends CustomFieldType> = Omit<CustomFieldDefinitionData, 'type' | 'choices' | 'rules'> & {
  type: T
}

type CustomFieldDefinitionChoicesField<T extends CustomFieldType>
  = CustomFieldChoicesModeByType<T> extends 'required'
    ? { choices: CustomFieldChoice[] }
    : { choices: null }

type CustomFieldDefinitionRulesField<T extends CustomFieldType>
  = CustomFieldRulesModeByType<T> extends 'required'
    ? { rules: CustomFieldRulesByType<T> }
    : CustomFieldRulesModeByType<T> extends 'optional'
      ? { rules: CustomFieldRulesByType<T> | null }
      : { rules: null }

export type CustomFieldDefinitionFieldsByType<T extends CustomFieldType>
  = BaseCustomFieldDefinitionFields<T>
    & CustomFieldDefinitionChoicesField<T>
    & CustomFieldDefinitionRulesField<T>

export type ResolvedCustomFieldDefinitionFields = {
  [T in CustomFieldType]: CustomFieldDefinitionFieldsByType<T>
}[CustomFieldType]

export type CustomFieldDefinitionFieldsMap = {
  [T in CustomFieldType]: CustomFieldDefinitionFieldsByType<T>
}
