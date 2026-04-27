import { ConfigurableModuleBuilder } from '@nestjs/common'
import { PgBossWorkerModuleOptions } from './pgboss-worker.module-options.js'

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  OPTIONS_TYPE,
  ASYNC_OPTIONS_TYPE
} = new ConfigurableModuleBuilder<PgBossWorkerModuleOptions>()
  .setClassMethodName('forRoot')
  .build()

export type PgbossWorkerModuleOptions = typeof OPTIONS_TYPE
export type PgbossWorkerModuleAsyncOptions = typeof ASYNC_OPTIONS_TYPE
