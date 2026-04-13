import { DataSource } from 'typeorm'
import { SnakeNamingStrategy } from '#src/naming/snake-case.naming-strategy.js'
import { sslHelper } from '#src/helpers/ssl.js'

export const dataSource = new DataSource({
  name: 'default',
  type: 'postgres',
  url: process.env.DATABASE_URI,
  ssl: sslHelper(process.env.DATABASE_SSL),
  extra: { max: 50 },
  logging: false,
  synchronize: false,
  migrationsRun: true,
  entities: ['dist/**/*.entity.js'],
  namingStrategy: new SnakeNamingStrategy()
})
