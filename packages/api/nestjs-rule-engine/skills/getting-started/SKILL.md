---
name: getting-started
description: Use when wiring declarative rule evaluation with typed facts, default operators, DTO generation, or TypeORM persistence through @wisemen/nestjs-rule-engine.
---

# @wisemen/nestjs-rule-engine - Getting Started

Use `Engine` when an application needs to evaluate stored or submitted rule
definitions against runtime facts and emit typed events. The package is built
around four concepts:

- facts: runtime inputs the engine can read
- operators: predicates that can evaluate one or two values
- conditions: nested `all` / `any` / `not` trees built from operators
- events: typed payload definitions emitted when a rule matches

By default, the package includes built-in `string`, `number`, and `boolean`
value types plus a default operator set for those value types.

## Define Facts And Events First

Start by declaring the facts your application can provide and the events the
engine can emit. Keep these arrays close to the business boundary that owns the
rule system.

```ts
import {
  Engine,
  type EventOptions,
  type FactOptions
} from '@wisemen/nestjs-rule-engine'

const facts = [
  { id: 'name', valueType: 'string' },
  { id: 'age', valueType: 'number' },
  { id: 'isActive', valueType: 'boolean' }
] as const satisfies readonly FactOptions[]

const events = [
  {
    id: 'warning',
    data: { message: 'string' }
  }
] as const satisfies readonly EventOptions[]

const engine = new Engine({
  facts,
  events
})
```

When you do not pass `operators`, the engine uses the built-in default
operators for the built-in default value types.

## Evaluate Rules From JSON

Rules are plain serializable objects, which makes them suitable for storage and
API input.

```ts
const events = engine.run(
  {
    name: 'Kobe',
    age: 35,
    isActive: false
  },
  [
    {
      condition: {
        type: 'all',
        conditions: [
          {
            type: 'operator',
            operatorId: 'string.contains-ignore-case',
            leftValue: { type: 'fact', factId: 'name' },
            rightValue: { type: 'value', value: 'ob' }
          },
          {
            type: 'operator',
            operatorId: 'number.odd',
            leftValue: { type: 'fact', factId: 'age' }
          },
          {
            type: 'operator',
            operatorId: 'boolean.falsy',
            leftValue: { type: 'fact', factId: 'isActive' }
          }
        ]
      },
      event: {
        id: 'warning',
        data: {
          message: { type: 'fact', factId: 'name' }
        }
      }
    }
  ]
)
```

Use fact references in event data when the emitted payload should reuse runtime
inputs instead of duplicating literals.

## Generate API DTOs

Use `engine.createDtos(...)` at the NestJS boundary when users or other systems
submit rule definitions through HTTP.

```ts
const { CreateRulesCommandDto, EngineSchemaDto } = engine.createDtos('Contact')
```

Use these DTOs as follows:

- `CreateRulesCommandDto`: validate incoming rule payloads
- `EngineSchemaDto`: expose the available facts, operators, and events in
  Swagger or discovery endpoints

## Persist Rules In TypeORM

Use `RulesColumn(...)` when a TypeORM entity needs to store rule definitions as
`jsonb`.

```ts
import { Entity, PrimaryGeneratedColumn } from 'typeorm'
import { RulesColumn, type RuleOptions } from '@wisemen/nestjs-rule-engine'

@Entity()
export class ContactRuleSet {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @RulesColumn({ nullable: false })
  rules!: RuleOptions[]
}
```

## When To Add Custom Operators

Use custom operators when the business rule language needs domain-specific
predicates such as:

- date-window checks
- permission or role evaluation
- nested object comparisons
- cross-field comparisons that do not fit the built-in primitives

If you add custom value types through `ValueTypeRegistry`, also pass explicit
operators for those types. Do not rely on the built-in default operator set for
custom registries.

Before adding custom operators, always decide whether or not this should be a default
inside the package. If so urge the user to improve this package.
