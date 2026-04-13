import { DataSource } from 'typeorm'

export const dataSource = new DataSource({
  name: 'default',
  type: 'postgres',
  url: process.env.DATABASE_URI,
  ssl: false,
  extra: { max: 50 },
  logging: false,
  synchronize: false,
  migrationsRun: true,
  entities: [
    'dist/**/int-range-test.entity.js',
    'dist/**/multi-int-range-test.entity.js'
  ]
})
