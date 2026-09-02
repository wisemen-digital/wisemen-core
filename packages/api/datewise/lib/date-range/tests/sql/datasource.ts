import { DataSource } from 'typeorm'

export const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URI,
  schema: 'datewise_date_range',
  ssl: false,
  extra: { max: 50 },
  logging: false,
  synchronize: false,
  migrationsRun: false,
  entities: [
    'dist/**/finite-date-range-test.entity.js',
    'dist/**/plain-date-test.entity.js',
  ],
  invalidWhereValuesBehavior: {
    null: 'throw',
    undefined: 'ignore',
  }
})
