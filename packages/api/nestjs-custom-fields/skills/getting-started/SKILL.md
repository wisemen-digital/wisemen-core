---
name: nestjs-custom-fields
description: Use when working with the @wisemen/nestjs-custom-fields package — developer-defined custom fields in NestJS with TypeORM persistence and runtime validation. Covers registering the CustomFieldDefinition entity, authoring definitions with customFieldDefinition(), storing resolved values via @CustomFieldValueColumn(), exposing them through CustomFieldValueDto / @IsCustomFields(), and validating submissions with CustomFieldDefinitionsRepository + validateCustomFieldValues(). Use this whenever a task involves custom field definitions, CustomFieldValue columns, custom-field DTOs, or tenant-scoped field definitions, even if the package is not named explicitly.
---

# @wisemen/nestjs-custom-fields - Getting Started

This package manages developer-defined custom field definitions and values. It
does not target end-user managed custom field creation, does not ship
migrations, and does not auto-discover definitions.

It is intended that custom field definitions are read-only for users.
Creating, updating, and deleting definitions is handled manually by developers
through migrations or `playground.ts` scripts.

Definition uniqueness is scoped by `entityType`. For non-tenant definitions,
`key` must be unique per `entityType`. For tenant-scoped definitions,
`key + tenantUuid` must be unique per `entityType`.

## Step 1: Register The Exported Entity And Create The Table

This package already exports the effective `CustomFieldDefinition` TypeORM
entity. Add it to your datasource entities yourself so TypeORM knows about the
table metadata. After that, generate and run a migration so the table and the
exported entity's partial unique indexes are created in your database.

```ts
import { DataSource } from 'typeorm'
import { CustomFieldDefinition } from '@wisemen/nestjs-custom-fields'

const datasource = new DataSource({
  entities: ['dist/src/**/*.entity.js', CustomFieldDefinition]
})
```

## Step 2: Define Definitions And Insert Them In The Database

Create a definition with `customFieldDefinition(...)`, then insert it yourself.
The package does not discover definitions automatically. At the moment this is
mainly done through a migration or through `playground.ts`.

For persisted definitions, `tenantUuid` is part of the definition shape and
should be `null` for non-tenant definitions or a tenant UUID for tenant-scoped
definitions. This is different from repository lookups, where `tenantUuid` is
optional and can simply be omitted.

`key` uniqueness is enforced per `entityType`. Use a unique `key` for global
definitions, and a unique `key + tenantUuid` combination for tenant-specific
definitions.

It is recommended to define your `entityType` values in an enum instead of
repeating string literals across your application.

```ts
import type { INestApplicationContext } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { JobContainer } from '@wisemen/app-container/fastify'
import { LocalizedString } from '@wisemen/localized-string'
import { DataSource } from 'typeorm'
import {
  CustomFieldDefinition,
  CustomFieldType,
  customFieldDefinition
} from '@wisemen/nestjs-custom-fields'

enum CustomFieldEntityType {
  TICKET = 'ticket'
}

export class Playground extends JobContainer {
  async bootstrap(): Promise<INestApplicationContext> {
    return await NestFactory.createApplicationContext(PlayGroundModule)
  }

  async execute(app: INestApplicationContext): Promise<void> {
    const priorityField = customFieldDefinition(CustomFieldType.SINGLE_SELECT, {
      tenantUuid: null,
      entityType: CustomFieldEntityType.TICKET,
      key: 'priority',
      label: new LocalizedString([{ locale: 'en', value: 'Priority' }]),
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
    })

    await app.get(DataSource).manager.insert(CustomFieldDefinition, priorityField)
  }
}
```

## Step 3: Store Values On The Entity With The Custom Column

Resolved custom field values live on your own entity. Use
`@CustomFieldValueColumn()` for the persisted values column.

```ts
import { Entity, PrimaryGeneratedColumn } from 'typeorm'
import { CustomFieldValueColumn, type CustomFieldValue } from '@wisemen/nestjs-custom-fields'

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  uuid: string

  @CustomFieldValueColumn({ nullable: true })
  customFields: CustomFieldValue[] | null
}
```

## Step 4: Receive And Show Values With DTOs

Requests and responses use the DTO layer from this package. For incoming
payloads, use `CustomFieldValueDto` with `@IsCustomFields()`. For outgoing
payloads, map stored values back with `CustomFieldValueDto.from(...)`.

```ts
// update-ticket.command.ts
import { ApiProperty } from '@nestjs/swagger'
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

// view-ticket.response.ts
@CustomFieldValueApiExtraModels()
export class ViewTicketResponse {
  @ApiProperty({ type: String, format: 'uuid' })
  uuid: string

  @CustomFieldValueDtoApiProperty({ isArray: true })
  customFields: CustomFieldValueDto[]

  constructor(ticket: Ticket) {
    this.uuid = ticket.uuid
    this.customFields = ticket.customFields?.map((value) => CustomFieldValueDto.from(value)) ?? []
  }
}
```

Calling `parse()` on a DTO turns the transport-friendly input into the domain
custom field value shape, including richer value objects when needed. For
example, a `MonetaryDto` is parsed into the package's monetary value object
instead of staying a plain JSON structure.

```ts
import {
  CustomFieldType,
  MonetaryCustomFieldValueDto
} from '@wisemen/nestjs-custom-fields'

const dto = new MonetaryCustomFieldValueDto()
dto.definitionUuid = definitionUuid
dto.value = {
  amount: '12.50',
  currency: 'EUR',
  precision: 2
}

const parsed = dto.parse()

// parsed is now a domain custom field value object:
// {
//   definitionUuid,
//   type: CustomFieldType.MONETARY,
//   value: dto.value.parse()
// }
```

## Step 5: Retrieve Definitions For Validation

When you process submitted values, retrieve the matching definitions through
`CustomFieldDefinitionsRepository` and validate against them with
`validateCustomFieldValues(...)`. If you also want to return definitions from
an API, map the same repository results with `CustomFieldDefinitionResponse`.
To inject the repository, register `CustomFieldDefinitionRepositoryModule` in
the Nest module that owns your use case or controller.

```ts
import { Module } from '@nestjs/common'
import { CustomFieldDefinitionRepositoryModule } from '@wisemen/nestjs-custom-fields'

@Module({
  imports: [CustomFieldDefinitionRepositoryModule],
  providers: [UpdateTicketUseCase]
})
export class UpdateTicketModule {}
```

`validateCustomFieldValues(...)` throws `CustomFieldValueValidationError` when
the submitted values do not match the definitions. In controllers, document
that error according to the `@wisemen/api-error` package pattern by registering
it with `@ApiErrorResponse(...)`.

```ts
import { ApiErrorResponse } from '@wisemen/api-error'
import { CustomFieldValueValidationError } from '@wisemen/nestjs-custom-fields'

@ApiErrorResponse(CustomFieldValueValidationError)
async update(...): Promise<void> {
  // controller logic
}
```
On repository lookups, `tenantUuid` is optional. Omit it to work with
non-tenant definitions, or set it to retrieve tenant-specific definitions in a
multi-tenant setup.

After DTO parsing, validate the resolved values against the definitions that
apply for that entity and tenant. This is the runtime check that enforces the
definition rules.

The runtime order matters: call `.parse()` on the DTOs first, then run
`validateCustomFieldValues(...)` against the definitions for that
`entityType` and tenant scope.

```ts
import { Injectable } from '@nestjs/common'
import {
  CustomFieldDefinitionResponse,
  CustomFieldDefinitionsRepository,
  validateCustomFieldValues
} from '@wisemen/nestjs-custom-fields'

enum CustomFieldEntityType {
  TICKET = 'ticket'
}

@Injectable()
export class UpdateTicketUseCase {
  constructor(
    private readonly repository: CustomFieldDefinitionsRepository
  ) {}

  async execute(command: UpdateTicketCommand): Promise<void> {
    const values = command.customFields.map((value) => value.parse())
    const definitions = await this.repository.findDefinitions({
      entityType: CustomFieldEntityType.TICKET
    })
    validateCustomFieldValues(definitions, values)

    // Remaining use-case logic
  }
}
```
