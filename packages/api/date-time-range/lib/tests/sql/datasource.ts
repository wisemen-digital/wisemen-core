import { DataSource } from 'typeorm'

export const dataSource = new DataSource({
  name: 'default',
  type: 'postgres',
  url: process.env.DATABASE_URI,
  ssl: false,
  extra: { max: 50 },
  logging: false,
  synchronize: false,
  migrationsRun: false,
  entities: ['dist/**/*.entity.js']
})
