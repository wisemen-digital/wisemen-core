import { ConfigurableModuleBuilder, Type } from '@nestjs/common'
import { PgBossWorkerModuleOptions } from './pgboss-worker.module-options.js'

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  OPTIONS_TYPE,
  ASYNC_OPTIONS_TYPE
} = new ConfigurableModuleBuilder<PgBossWorkerModuleOptions>()
  .setClassMethodName('forRoot')
  .build()

type BouncerOptions = {
  /**
   * The bouncer can prevent the worker from polling for jobs.
   * A bouncer is provided as a nestjs module with a provider for QueueBouncer.
   * This provider needs to be exported as well.
   *
   * When no bouncer is needed, or the it is misconfigured, the worker will default
   * to an allow bouncer (i.e. the bouncer never prevents the worker from polling for jobs).
   */
  bouncerModule?: Type<unknown>
}

export type PgbossWorkerModuleOptions = typeof OPTIONS_TYPE & BouncerOptions

export type PgbossWorkerModuleAsyncOptions = typeof ASYNC_OPTIONS_TYPE & BouncerOptions
