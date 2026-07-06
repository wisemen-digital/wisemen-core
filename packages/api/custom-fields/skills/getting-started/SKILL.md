---
name: getting-started
description: Use when working with developer-defined custom fields in NestJS apis with TypeORM persistence and runtime validation.
---

# @wisemen/custom-fields - Getting Started

Use `customFieldDefinition(...)` to define custom fields in application code.
Use `CustomFieldDefinition` as the canonical persisted entity,
`CustomFieldValueDto` in request DTOs, `@IsCustomFields()` to validate
submitted values, `validateCustomFieldValues(...)` in use cases, and
`@CustomFieldValueColumn()` to persist resolved values on other entities.

`@IsCustomFields()` already validates that the property is an array, validates
the nested DTOs, and enforces uniqueness by `definitionUuid`, so those
decorators do not need to be added separately.

Custom field definitions are intended to be created and maintained by
developers. This package does not target end-user managed custom field
creation, and it does not ship TypeORM migrations.

```ts
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { LocalizedString } from '@wisemen/localized-string'
import { Entity, PrimaryGeneratedColumn, Repository } from 'typeorm'
import {
  customFieldDefinition,
  CustomFieldDefinition,
  CustomFieldType,
  type CustomFieldValue,
  CustomFieldValueApiExtraModels,
  CustomFieldValueColumn,
  CustomFieldValueDto,
  CustomFieldValueDtoApiProperty,
  IsCustomFields,
  validateCustomFieldValues,
} from '@wisemen/custom-fields'

export const PriorityField = customFieldDefinition(
  CustomFieldType.SINGLE_SELECT,
  {
    tenantUuid: null,
    entityType: 'ticket',
    key: 'priority',
    label: new LocalizedString([{ locale: 'en', value: 'Priority' }]),
    description: null,
    isRequired: true,
    choices: [
      {
        value: 'low',
        order: 1,
        label: new LocalizedString([{ locale: 'en', value: 'Low' }]),
      },
      {
        value: 'high',
        order: 2,
        label: new LocalizedString([{ locale: 'en', value: 'High' }]),
      },
    ],
  },
)

@CustomFieldValueApiExtraModels()
export class UpdateTicketCommand {
  @CustomFieldValueDtoApiProperty({ isArray: true })
  @IsCustomFields()
  customFields: CustomFieldValueDto[]
}

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  uuid: string

  @CustomFieldValueColumn({ nullable: true })
  customFields: CustomFieldValue[] | null
}

@Injectable()
export class UpdateTicketCustomFieldsUseCase {
  constructor(
    @InjectRepository(CustomFieldDefinition)
    private readonly customFieldDefinitionRepository: Repository<CustomFieldDefinition>,
  ) {}

  async execute(command: UpdateTicketCommand): Promise<void> {
    const definitions = await this.customFieldDefinitionRepository.find({
      where: {
        entityType: 'ticket',
      },
    })

    const values = command.customFields.map(value => value.parse())

    validateCustomFieldValues(definitions, values)
  }
}
```

Add `CustomFieldDefinition` to the datasource entities, and create your own
application migration for its partial unique indexes.
