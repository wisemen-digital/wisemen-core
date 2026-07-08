import { ApiProperty } from '@nestjs/swagger'
import { LocalizedStringDto } from '@wisemen/localized-string'
import type { CustomFieldDefinitionData } from '#src/custom-field-definition.js'
import { CustomFieldType, CustomFieldTypeApiProperty } from '#src/enum/custom-field-type.enum.js'
import type { CustomFieldDefinitionUuid } from '#src/custom-field-definition.uuid.js'
import type { CustomFieldRules } from '#src/custom-field-rules.js'
import { CustomFieldChoice } from '#src/custom-field-choice.js'

class CustomFieldChoiceResponse {
  @ApiProperty({ type: String })
  value: string

  @ApiProperty({ type: LocalizedStringDto, isArray: true })
  label: LocalizedStringDto[]

  @ApiProperty({ type: Number })
  order: number

  constructor(choice: CustomFieldChoice) {
    this.value = choice.value
    this.label = LocalizedStringDto.from(choice.label)
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

  @ApiProperty({ type: LocalizedStringDto })
  label: LocalizedStringDto

  @ApiProperty({ type: LocalizedStringDto, nullable: true })
  description: LocalizedStringDto | null

  @CustomFieldTypeApiProperty()
  type: CustomFieldType

  @ApiProperty({ type: Boolean })
  isRequired: boolean

  @ApiProperty({ type: CustomFieldChoiceResponse, isArray: true, nullable: true })
  choices: CustomFieldChoiceResponse[] | null

  @ApiProperty({ type: Object, nullable: true })
  rules: CustomFieldRules | null

  constructor(definition: CustomFieldDefinitionData) {
    this.uuid = definition.uuid
    this.tenantUuid = definition.tenantUuid
    this.entityType = definition.entityType
    this.key = definition.key
    this.label = LocalizedStringDto.from(definition.label)
    this.description = definition.description !== null
      ? LocalizedStringDto.from(definition.description)
      : null
    this.type = definition.type
    this.isRequired = definition.isRequired
    this.choices = definition.choices?.map(choice => new CustomFieldChoiceResponse(choice)) ?? null
    this.rules = definition.rules
  }
}

