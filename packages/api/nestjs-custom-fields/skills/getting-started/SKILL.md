---
name: getting-started
description: Use when working with developer-defined custom fields in NestJS apis with TypeORM persistence and runtime validation.
---

# @wisemen/nestjs-custom-fields - Getting Started

Use `customFieldDefinition(...)` to define custom fields in application code.
Use `CustomFieldDefinition` as the canonical persisted entity,
`CustomFieldDefinitionResponse` in API responses that return definitions,
`CustomFieldValueDto` in request and response DTOs, `@IsCustomFields()` to
validate submitted values, `CustomFieldValueDto.from(...)` to map persisted
values back into API responses, `validateCustomFieldValues(...)` in use cases,
`ViewCustomFieldDefinitionsModule`, `ViewCustomFieldDefinitionsUseCase`, and
`ViewCustomFieldDefinitionsQuery` to read definitions by tenant and
`entityType`, and `@CustomFieldValueColumn()` to persist resolved values on
other entities.

`@IsCustomFields()` already validates that the property is an array, validates
the nested DTOs, and enforces uniqueness by `definitionUuid`, so those
decorators do not need to be added separately.

Custom field definitions are intended to be created and maintained by
developers. This package does not target end-user managed custom field
creation, and it does not ship TypeORM migrations.

```ts
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { LocalizedString } from '@wisemen/localized-string'
import { Entity, PrimaryGeneratedColumn, Repository } from 'typeorm'
import {
  customFieldDefinition,
  CustomFieldDefinition,
  CustomFieldDefinitionResponse,
  CustomFieldType,
  type CustomFieldValue,
  CustomFieldValueApiExtraModels,
  CustomFieldValueColumn,
  CustomFieldValueDto,
  CustomFieldValueDtoApiProperty,
  IsCustomFields,
  validateCustomFieldValues,
  ViewCustomFieldDefinitionsQuery,
  ViewCustomFieldDefinitionsUseCase,
} from '@wisemen/nestjs-custom-fields'

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

@CustomFieldValueApiExtraModels()
export class TicketResponseDto {
  @CustomFieldValueDtoApiProperty({ isArray: true })
  customFields: CustomFieldValueDto[]

  static fromTicket(ticket: Ticket): TicketResponseDto {
    return {
      customFields: (ticket.customFields ?? []).map(customField =>
        CustomFieldValueDto.from(customField),
      ),
    }
  }
}

export class TicketDefinitionResponseDto {
  @ApiProperty({ type: CustomFieldDefinitionResponse, isArray: true })
  definitions: CustomFieldDefinitionResponse[]

  static fromDefinitions(
    definitions: CustomFieldDefinition[],
  ): TicketDefinitionResponseDto {
    return {
      definitions: definitions.map(definition =>
        new CustomFieldDefinitionResponse(definition),
      ),
    }
  }
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

@Injectable()
export class ViewTicketCustomFieldDefinitionsUseCase {
  constructor(
    private readonly viewCustomFieldDefinitionsUseCase: ViewCustomFieldDefinitionsUseCase,
  ) {}

  async execute(
    tenantUuid: string | null,
    query: ViewCustomFieldDefinitionsQuery,
  ): Promise<CustomFieldDefinitionResponse[]> {
    return await this.viewCustomFieldDefinitionsUseCase.execute(tenantUuid, query)
  }
}
```

`CustomFieldValueDto.from(...)` keeps the concrete custom field type in the
response and converts values into DTO-friendly shapes such as ISO strings for
timestamps and `MonetaryDto` for monetary values.

`new CustomFieldDefinitionResponse(definition)` maps persisted definition
entities into API-friendly responses, including localized labels, select
choices, and rules.

Register `ViewCustomFieldDefinitionsModule` in your Nest feature module when
you want the package to provide `ViewCustomFieldDefinitionsUseCase` with its
repository dependency. `ViewCustomFieldDefinitionsUseCase.execute(...)`
returns only global definitions when `tenantUuid` is `null`, only tenant
definitions when `tenantUuid` is set, and orders results by `key ASC`.

Add `CustomFieldDefinition` to the datasource entities, and create your own
application migration for its partial unique indexes.
