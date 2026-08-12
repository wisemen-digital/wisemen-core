# @wisemen/nestjs-rule-engine

Typed rule evaluation for NestJS applications. Define facts, operators, and
events once, then evaluate JSON rule definitions against runtime facts,
generate DTOs for rule authoring, and persist those rules as `jsonb` when
needed.

By default the package ships with:

- built-in value types: `string`, `number`, `boolean`
- built-in operators for string, number, and boolean matching
- DTO generation for Swagger and runtime validation
- a `RulesColumn(...)` helper for TypeORM persistence

## Define Facts And Events

Start by defining the facts your application can supply at runtime and the
events the engine can emit when a rule matches.

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
  },
  {
    id: 'status',
    data: { active: 'boolean', age: 'number' }
  }
] as const satisfies readonly EventOptions[]

const engine = new Engine({
  facts,
  events
})
```

When you do not provide custom operators, `Engine` uses the built-in default
operator set for the built-in value types.

## Evaluate Rules

Rules are plain JSON objects. Conditions can be nested with `all`, `any`, and
`not`, and operator conditions can compare literal values or runtime facts.

```ts
const result = engine.run(
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

`result` is a typed array of emitted events whose payload values are resolved
through the configured value type registry.

## Built-In Operators

The default operator set is exported as `DEFAULT_OPERATORS` and grouped by value
type:

- boolean: `truthy`, `falsy`, `equals`, `not-equals`
- number: `equals`, `not-equals`, `greater-than`, `greater-than-or-equal`,
  `less-than`, `less-than-or-equal`, `divisible-by`, `zero`, `positive`,
  `negative`, `non-positive`, `non-negative`, `even`, `odd`
- string: equality, contains, starts-with, ends-with, case-insensitive
  variants, emptiness checks, blank checks, and string-length comparisons

Use these exports directly when you want to extend or inspect the built-in set:

```ts
import {
  DEFAULT_OPERATORS,
  DEFAULT_STRING_OPERATORS
} from '@wisemen/nestjs-rule-engine'
```

## Generate DTOs

Use `engine.createDtos(...)` when your application needs validated and
Swagger-documented DTOs for authoring rules through an API.

```ts
const { CreateRulesCommandDto, EngineSchemaDto } = engine.createDtos('Contact')
```

- `CreateRulesCommandDto` validates submitted rule payloads
- `EngineSchemaDto` describes the available facts, operators, and events

## Persist Rules With TypeORM

Use `RulesColumn(...)` to store rule definitions in a `jsonb` column.

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

## Custom Value Types And Operators

Use `ValueTypeRegistry` when your application needs value types beyond
`string`, `number`, and `boolean`.

If you introduce custom value types, also provide matching custom operators.
The built-in default operators are only intended for the built-in default value
type registry.
