import { DataSource } from 'typeorm'

export const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URI,
  schema: 'date_time_range',
  ssl: false,
  extra: { max: 50 },
  logging: false,
  synchronize: false,
  migrationsRun: false,
  entities: ['dist/**/*.entity.js'],
  invalidWhereValuesBehavior: {
    null: 'throw',
    undefined: 'ignore',
  }
})
