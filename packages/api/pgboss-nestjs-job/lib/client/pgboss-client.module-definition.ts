import { ConfigurableModuleBuilder } from '@nestjs/common'
import { PgBossClientModuleOptions } from './pgboss-client.module-options.js'

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN }
  = new ConfigurableModuleBuilder<PgBossClientModuleOptions>().setClassMethodName('forRoot').build()
