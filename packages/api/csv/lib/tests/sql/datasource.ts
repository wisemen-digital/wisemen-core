import { DataSource } from 'typeorm'
import { CsvEncodeStreamTest } from './csv-encode-stream-test.entity.js'

export const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URI,
  schema: 'csv',
  ssl: false,
  extra: { max: 50 },
  logging: false,
  synchronize: false,
  migrationsRun: false,
  entities: [CsvEncodeStreamTest],
  invalidWhereValuesBehavior: {
    null: 'throw',
    undefined: 'ignore',
  }
})
