import { DataSource } from 'typeorm'
import { CustomFieldDefinition } from '#src/typeorm/custom-field-definition.entity.js'

export const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URI,
  ssl: false,
  extra: { max: 50 },
  logging: false,
  synchronize: false,
  migrationsRun: false,
  entities: [CustomFieldDefinition],
  invalidWhereValuesBehavior: {
    null: 'throw',
    undefined: 'ignore',
  }
})
