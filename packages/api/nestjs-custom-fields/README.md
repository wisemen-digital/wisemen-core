# @wisemen/nestjs-custom-fields

Custom field definitions and values for NestJS applications with TypeORM
persistence, DTO support, and runtime validation.

## Overview

This package provides:

- the canonical `CustomFieldDefinition` TypeORM entity
- typed definition creation via `customFieldDefinition(...)`
- response mapping through `CustomFieldDefinitionResponse`
- a read use-case through `ViewCustomFieldDefinitionsModule`,
  `ViewCustomFieldDefinitionsUseCase`, and
  `ViewCustomFieldDefinitionsQuery`
- custom field value DTOs through `CustomFieldValueDto`
- nested DTO validation through `IsCustomFields()`
- Swagger schema helpers through `CustomFieldValueApiExtraModels()` and
  `CustomFieldValueDtoApiProperty()`
- runtime validation through `validateCustomFieldValue(...)` and
  `validateCustomFieldValues(...)`
- JSONB column helpers through `CustomFieldChoiceColumn` and
  `CustomFieldValueColumn`

Custom field definitions are intended to be created and maintained by
developers in application code. This package does not target end-user managed
custom field creation.

## Define Custom Field Definitions

Create definitions in code with `customFieldDefinition(...)` before persisting
them through `CustomFieldDefinition`.

```ts
import { LocalizedString } from '@wisemen/localized-string'
import {
  customFieldDefinition,
  CustomFieldType
} from '@wisemen/nestjs-custom-fields'

export const OrderReferenceField = customFieldDefinition(CustomFieldType.TEXT, {
  tenantUuid: null,
  entityType: 'order',
  key: 'reference',
  label: new LocalizedString([
    { locale: 'en', value: 'Reference' }
  ]),
  description: null,
  isRequired: true,
  rules: {
    minLength: 3,
    maxLength: 50
  }
})
```

```ts
import { LocalizedString } from '@wisemen/localized-string'
import {
  customFieldDefinition,
  CustomFieldType
} from '@wisemen/nestjs-custom-fields'

export const PriorityField = customFieldDefinition(
  CustomFieldType.SINGLE_SELECT,
  {
    tenantUuid: '2fa7de6e-c03a-4387-8c28-8e16bc2f7e84',
    entityType: 'ticket',
    key: 'priority',
    label: new LocalizedString([
      { locale: 'en', value: 'Priority' }
    ]),
    description: null,
    isRequired: true,
    choices: [
      {
        value: 'low',
        order: 1,
        label: new LocalizedString([{ locale: 'en', value: 'Low' }])
      },
      {
        value: 'high',
        order: 2,
        label: new LocalizedString([{ locale: 'en', value: 'High' }])
      }
    ]
  }
)
```

Use `tenantUuid: null` for global definitions and a tenant UUID for
tenant-scoped definitions.

## Return Custom Field Definitions In Responses

Use `CustomFieldDefinitionResponse` when an API returns persisted custom field
definitions. It maps the entity fields, localized values, select choices, and
rules into a Swagger-friendly response DTO.

```ts
import {
  CustomFieldDefinition,
  CustomFieldDefinitionResponse
} from '@wisemen/nestjs-custom-fields'

export class TicketCustomFieldDefinitionResponse {
  definitions: CustomFieldDefinitionResponse[]

  static fromDefinitions(
    definitions: CustomFieldDefinition[]
  ): TicketCustomFieldDefinitionResponse {
    return {
      definitions: definitions.map(definition =>
        new CustomFieldDefinitionResponse(definition)
      )
    }
  }
}
```

## Register The TypeORM Entity

Include `CustomFieldDefinition` in the datasource entities and use it as the
canonical persistence model for definitions.

```ts
import { CustomFieldDefinition } from '@wisemen/nestjs-custom-fields'

entities: ['dist/src/**/*.entity.js', CustomFieldDefinition]
```

## Create The Migration

This package does not ship TypeORM migrations. Applications should create their
own migrations and keep them aligned with the exported entity metadata,
including the same partial unique indexes.

```sql
CREATE UNIQUE INDEX "IDX_custom_field_definition_global_entity_type_key"
ON "custom_field_definition" ("entityType", "key")
WHERE "tenantUuid" IS NULL;

CREATE UNIQUE INDEX "IDX_custom_field_definition_tenant_entity_type_key"
ON "custom_field_definition" ("tenantUuid", "entityType", "key")
WHERE "tenantUuid" IS NOT NULL;
```

This keeps global definitions unique by `entityType + key` and tenant
definitions unique by `tenantUuid + entityType + key`.

## Read Definitions Through The Exported Use-Case

This package also exports a ready-to-wire NestJS read use-case for listing
custom field definitions by `entityType` and tenant scope:

- `ViewCustomFieldDefinitionsModule`
- `ViewCustomFieldDefinitionsUseCase`
- `ViewCustomFieldDefinitionsQuery`

The query currently supports:

- `entityType?: string`

When `tenantUuid` is `null`, the use-case returns only global definitions. When
`tenantUuid` is set, it returns only definitions for that tenant. Results are
ordered by `key ASC`.

```ts
import { Controller, Get, Query } from '@nestjs/common'
import {
  CustomFieldDefinitionResponse,
  ViewCustomFieldDefinitionsQuery,
  ViewCustomFieldDefinitionsUseCase
} from '@wisemen/nestjs-custom-fields'

@Controller('custom-field-definitions')
export class ViewTicketCustomFieldDefinitionsController {
  constructor(
    private readonly viewCustomFieldDefinitionsUseCase: ViewCustomFieldDefinitionsUseCase
  ) {}

  @Get()
  async index(
    @Query() query: ViewCustomFieldDefinitionsQuery
  ): Promise<CustomFieldDefinitionResponse[]> {
    return await this.viewCustomFieldDefinitionsUseCase.execute(null, query)
  }
}
```

Register `ViewCustomFieldDefinitionsModule` in your feature module when you
want Nest to provide the exported use-case with its repository dependency.

## Accept Custom Field Values In DTOs

Use `IsCustomFields()` on DTO properties that accept arrays of custom field
values. For Swagger, register the discriminator models on the DTO class and use
`CustomFieldValueDtoApiProperty()` on the property.

`@IsCustomFields()` already applies array validation, nested DTO validation,
and uniqueness on `definitionUuid`, so those decorators do not need to be added
separately.

```ts
import {
  CustomFieldValueApiExtraModels,
  CustomFieldValueDto,
  CustomFieldValueDtoApiProperty,
  IsCustomFields
} from '@wisemen/nestjs-custom-fields'

@CustomFieldValueApiExtraModels()
export class UpdateTicketCommand {
  @CustomFieldValueDtoApiProperty({ isArray: true })
  @IsCustomFields()
  customFields: CustomFieldValueDto[]
}
```

## Return Custom Field Values In Responses

Use `CustomFieldValueDto` in response DTOs as well. Register the Swagger
discriminator models on the response class and map stored domain values back to
DTOs with `CustomFieldValueDto.from(...)`.

```ts
import {
  CustomFieldValueApiExtraModels,
  CustomFieldValueDto,
  CustomFieldValueDtoApiProperty
} from '@wisemen/nestjs-custom-fields'

@CustomFieldValueApiExtraModels()
export class TicketResponseDto {
  @CustomFieldValueDtoApiProperty({ isArray: true })
  customFields: CustomFieldValueDto[]

  static fromTicket(ticket: Ticket): TicketResponseDto {
    return {
      customFields: (ticket.customFields ?? []).map(customField =>
        CustomFieldValueDto.from(customField)
      )
    }
  }
}
```

`CustomFieldValueDto.from(...)` preserves the concrete custom field type and
converts values to the response format expected by the DTOs, such as ISO
strings for timestamps and `MonetaryDto` for monetary values.

## Parse And Validate Values

Parse request DTOs into domain values and validate them against the resolved
definitions before storing or using them.

```ts
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import {
  CustomFieldDefinition,
  validateCustomFieldValues
} from '@wisemen/nestjs-custom-fields'
import { Repository } from 'typeorm'

@Injectable()
export class UpdateTicketCustomFieldsUseCase {
  constructor(
    @InjectRepository(CustomFieldDefinition)
    private readonly customFieldDefinitionRepository: Repository<CustomFieldDefinition>
  ) {}

  async execute(
    command: UpdateTicketCommand
  ): Promise<void> {
    const definitions = await this.customFieldDefinitionRepository.find({
      where: {
        entityType: 'ticket'
      }
    })

    const values = command.customFields.map(value => value.parse())

    validateCustomFieldValues(definitions, values)
  }
}
```

`validateCustomFieldValues(...)` checks:

- duplicate definitions
- duplicate submitted values
- required definitions
- matching `definitionUuid` and `type`
- allowed select choices
- configured field rules

## Persist Custom Field Values On Other Entities

Use `CustomFieldValueColumn()` on entities that store resolved custom field
values.

```ts
import { Entity, PrimaryGeneratedColumn } from 'typeorm'
import {
  CustomFieldValue,
  CustomFieldValueColumn
} from '@wisemen/nestjs-custom-fields'

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  uuid: string

  @CustomFieldValueColumn({ nullable: true })
  customFields: CustomFieldValue[] | null
}
```
