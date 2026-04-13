# typeorm-to-dbml

Convert a TypeScript project using TypeORM decorators to a DBML diagram.

## Installation

```bash
npm install
npm build
```

## Usage

```bash
npm start <sourceGlob> [outputPath]
```

### Parameters

- `sourceGlob` (required): Glob pattern to match TypeORM entity files (e.g., `"src/entities/**/*.ts"`)
- `outputPath` (optional): Path to output DBML file (default: `./schema.dbml`)

### Example

```bash
npm start "examples/entities/**/*.ts" "./schema.dbml"
```

## Features

The tool supports the following TypeORM decorators:

- **`@Entity`**: Converts to a DBML table. The table name is derived from the class name or the argument passed to the decorator.

- **`@PrimaryColumn`**: Defines a primary key column.
  - You can specify the column type using the `type` option (e.g., `{ type: 'uuid' }`).

- **`@PrimaryGeneratedColumn`**: Defines the primary key column.
  - By default, it creates an `integer` column with `[pk, increment]`.
  - If the `'uuid'` strategy is used, it generates a `varchar [pk]` column.

- **`@Column`**: Defines a regular table column.
  - **Type Inference**: If no type is specified, it maps TypeScript types to DBML types (e.g., `string` to `varchar`).
  - **Options**:
    - `type`: Explicitly sets the column type (e.g., `{ type: 'jsonb' }`).
    - `nullable`: Marks the column as nullable (e.g., `{ nullable: true }`).
    - `default`: Sets a default value for the column (e.g., `{ default: true }`).

- **`@ManyToOne`**: Extracts the target entity to create a foreign key relationship.

- **`@OneToOne`**: Extracts the target entity to create a one-to-one relationship.

- **`@JoinColumn`**: Used with `@ManyToOne` to specify the foreign key column name via the `name` option.

- **`@CreatedDateColumn`**: Creates a `timestamp` column for creation date.

- **`@UpdateDateColumn`**: Creates a `timestamp` column for last update date.

- **`@DeleteDateColumn`**: Creates a nullable `timestamp` column for soft delete date.

### Type Mapping (When type is not explicitly specified)

| TypeScript Type | DBML Type   |
| --------------- | ----------- |
| `string`        | `varchar`   |
| `number`        | `integer`   |
| `boolean`       | `boolean`   |
| `Date`          | `timestamp` |
| `any`           | `text`      |

## Example Output

Given TypeORM entities like:

```typescript
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ type: "boolean", default: true })
  isActive: boolean;

  @Column({ type: "jsonb" })
  customFields: object;
}

@Entity("posts")
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @ManyToOne(() => User)
  author: User;
}
```

The tool generates:

```dbml
Table user {
  id integer [pk, increment]
  name varchar
  bio varchar [null]
  is_active boolean [default: true]
  custom_fields jsonb
}

Table posts {
  id integer [pk, increment]
  title varchar
}

// relationships
Ref: posts.author_id > user.id
```
