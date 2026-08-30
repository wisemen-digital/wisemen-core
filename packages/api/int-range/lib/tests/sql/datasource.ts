import { DataSource } from 'typeorm'

export const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URI,
  schema: 'int_range',
  ssl: false,
  extra: { max: 50 },
  logging: false,
  synchronize: false,
  migrationsRun: false,
  entities: [
    'dist/**/int-range-test.entity.js',
    'dist/**/multi-int-range-test.entity.js'
  ],
  invalidWhereValuesBehavior: {
    null: 'throw',
    undefined: 'ignore',
  }
})
