import { Module } from '@nestjs/common'
import { PgBossClient } from './pgboss-client.js'
import { ConfigurableModuleClass } from './pgboss-client.module-definition.js'

@Module({
  providers: [PgBossClient],
  exports: [PgBossClient]
})
export class PgBossClientModule extends ConfigurableModuleClass {}
