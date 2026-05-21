import { DataSource } from 'typeorm'
import { ScopedFilterTest } from './scoped-filter-test.entity.js'

export const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URI,
  ssl: false,
  extra: { max: 50 },
  logging: false,
  synchronize: false,
  migrationsRun: true,
  entities: [ScopedFilterTest],
  invalidWhereValuesBehavior: {
    null: 'throw',
    undefined: 'ignore',
  }
})
