import { ColumnType, DataSource } from 'typeorm'
import { FilterConditionsTest } from './filter-conditions-test.entity.js'
import { ScopedFilterTest } from './scoped-filter-test.entity.js'

export const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URI,
  ssl: false,
  extra: { max: 50 },
  logging: false,
  synchronize: false,
  migrationsRun: true,
  entities: [ScopedFilterTest, FilterConditionsTest],
  invalidWhereValuesBehavior: {
    null: 'throw',
    undefined: 'ignore',
  }
})

dataSource.driver.supportedDataTypes.push('tstzrange3' as ColumnType)
dataSource.driver.supportedDataTypes.push('tstzmultirange3' as ColumnType)
