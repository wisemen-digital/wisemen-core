import { DataSource } from 'typeorm'
import { SnakeNamingStrategy } from '#src/naming/snake-case.naming-strategy.js'
import { sslHelper } from '#src/helpers/ssl.js'

export const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URI,
  schema: 'nestjs_typeorm_operators',
  ssl: sslHelper(process.env.DATABASE_SSL),
  extra: { max: 50 },
  logging: false,
  synchronize: false,
  migrationsRun: false,
  entities: ['dist/**/test.entity.js'],
  namingStrategy: new SnakeNamingStrategy(),
  invalidWhereValuesBehavior: {
    null: 'throw',
    undefined: 'ignore',
  }
})
