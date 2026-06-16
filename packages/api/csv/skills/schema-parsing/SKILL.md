---
name: schema-parsing
description: Use when parsing CSVs in APIs.
type: core
library: csv
---

# @wisemen/csv - Schema Parsing

Use `@wisemen/csv` when you already have CSV rows as `Record<string, string>[]`
and need one typed parse step with aggregated validation errors. The package is
centered around `CSVField` and `CSVSchema`: map source headers with
`CSVField.name`, parse them into typed output properties, then handle a single
`CSVSchemaParseError` if any row fails.

## Define The Schema

```ts
import { CSVField, CSVSchema, CSVSchemaParseError, Refinement, Translator } from '@wisemen/csv'

enum Status {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

const employeeSchema = new CSVSchema({
  firstName: new CSVField({
    name: 'Voornaam',
    type: 'string',
  }),
  birthdate: new CSVField({
    name: 'Geboortedatum',
    type: 'date',
  }),
  status: new CSVField({
    name: 'Status',
    type: 'enum',
    enum: Status,
    translator: new Translator({
      actief: Status.ACTIVE,
      inactief: Status.INACTIVE,
    }),
  }),
  managerEmail: new CSVField({
    name: 'Manager e-mail',
    type: 'string',
    nullable: true,
    required: false,
  }),
  externalId: new CSVField({
    name: 'Extern id',
    type: 'string',
    refinement: new Refinement((value, _row, rowIndex, rows) => {
      return rows.findIndex((candidate) => candidate.externalId === value) === rowIndex
    }),
  }),
})
```

The object key (`firstName`) is the parsed output property. `name` is the CSV
header to read from the raw record.

## Parse And Handle Failures

```ts
try {
  const employees = await employeeSchema.parse(records)

  employees[0].status
  //    ^? Status
} catch (error) {
  if (error instanceof CSVSchemaParseError) {
    for (const fieldError of error.errors) {
      console.error(fieldError.rowIndex, fieldError.column, fieldError.code)
    }
  }
}
```

`parse()` collects every `CSVFieldParseError` before throwing, so you can return
one import report instead of failing on the first bad cell.

## Field Rules To Rely On

- `type: 'int'` parses integers; invalid values throw `invalid_int`.
- `type: 'boolean'` accepts `1`/`0` and `true`/`false`.
- `type: 'date'` only accepts `YYYY-MM-DD`.
- `isArray: true` splits comma-separated values and parses each item.
- `nullable: true` turns an empty string into `null`.
- `required: false` allows a missing column value to stay `undefined`.

Keep translators for input normalization and refinements for business rules.
Use the base field types for structural parsing only.
