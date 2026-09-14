import { DataSource } from 'typeorm'

export const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URI,
  schema: 'datewise_date_time_range',
  ssl: false,
  extra: { max: 50 },
  logging: false,
  synchronize: false,
  migrationsRun: false,
  entities: [
    'dist/**/date-time-range-test.entity.js',
    'dist/**/multi-date-time-range-test.entity.js',
    'dist/**/finite-date-time-range-test.entity.js',
    'dist/**/timestamp-test.entity.js',
    'dist/**/date-test.entity.js'
  ],
  invalidWhereValuesBehavior: {
    null: 'throw',
    undefined: 'ignore',
  }
})
