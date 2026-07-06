import { ApiProperty } from '@nestjs/swagger'
import { LocalizedString, LocalizedValue } from '@wisemen/localized-string'
import type { CustomFieldDefinitionFields } from '#src/custom-field-definition.js'
import { CustomFieldType, CustomFieldTypeApiProperty } from '#src/enum/custom-field-type.enum.js'
import type { CustomFieldDefinitionUuid } from '#src/custom-field-definition.uuid.js'
import type { CustomFieldRules } from '#src/custom-field-rules.js'
import { CustomFieldChoice } from '#src/custom-field-choice.js'

class LocalizedValueResponse {
  @ApiProperty({ type: String })
  locale: string

  @ApiProperty({ type: String })
  value: string

  constructor(localizedValue: LocalizedValue) {
    this.locale = localizedValue.locale
    this.value = localizedValue.value
  }
}

class CustomFieldChoiceResponse {
  @ApiProperty({ type: String })
  value: string

  @ApiProperty({ type: LocalizedValueResponse, isArray: true })
  label: LocalizedValueResponse[]

  @ApiProperty({ type: Number })
  order: number

  constructor(choice: CustomFieldChoice) {
    this.value = choice.value
    this.label = toLocalizedValueResponses(choice.label)
    this.order = choice.order
  }
}

export class CustomFieldDefinitionResponse {
  @ApiProperty({ type: String, format: 'uuid' })
  uuid: CustomFieldDefinitionUuid

  @ApiProperty({ type: String, format: 'uuid', nullable: true })
  tenantUuid: string | null

  @ApiProperty({ type: String })
  entityType: string

  @ApiProperty({ type: String })
  key: string

  @ApiProperty({ type: LocalizedValueResponse, isArray: true })
  label: LocalizedValueResponse[]

  @ApiProperty({ type: LocalizedValueResponse, isArray: true, nullable: true })
  description: LocalizedValueResponse[] | null

  @CustomFieldTypeApiProperty()
  type: CustomFieldType

  @ApiProperty({ type: Boolean })
  isRequired: boolean

  @ApiProperty({ type: CustomFieldChoiceResponse, isArray: true, nullable: true })
  choices: CustomFieldChoiceResponse[] | null

  @ApiProperty({ type: Object, nullable: true })
  rules: CustomFieldRules | null

  constructor(definition: CustomFieldDefinitionFields) {
    this.uuid = definition.uuid
    this.tenantUuid = definition.tenantUuid
    this.entityType = definition.entityType
    this.key = definition.key
    this.label = toLocalizedValueResponses(definition.label)
    this.description = definition.description !== null
      ? toLocalizedValueResponses(definition.description)
      : null
    this.type = definition.type
    this.isRequired = definition.isRequired
    this.choices = definition.choices?.map(choice => new CustomFieldChoiceResponse(choice)) ?? null
    this.rules = definition.rules
  }

  static from(definition: CustomFieldDefinitionFields): CustomFieldDefinitionResponse
  static from(definition: null): null
  static from(definition: CustomFieldDefinitionFields | null): CustomFieldDefinitionResponse | null
  static from(definition: CustomFieldDefinitionFields | null): CustomFieldDefinitionResponse | null {
    return definition !== null ? new CustomFieldDefinitionResponse(definition) : null
  }
}

function toLocalizedValueResponses(value: LocalizedString): LocalizedValueResponse[] {
  return value.toJSON().map(item => (new LocalizedValueResponse(item)))
}
