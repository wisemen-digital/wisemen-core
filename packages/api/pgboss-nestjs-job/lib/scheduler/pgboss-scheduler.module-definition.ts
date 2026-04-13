import { ConfigurableModuleBuilder } from '@nestjs/common'
import { PgBossSchedulerModuleOptions } from './pgboss-scheduler.module-options.js'

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  OPTIONS_TYPE,
  ASYNC_OPTIONS_TYPE
} = new ConfigurableModuleBuilder<PgBossSchedulerModuleOptions>()
  .setClassMethodName('forRoot')
  .build()
