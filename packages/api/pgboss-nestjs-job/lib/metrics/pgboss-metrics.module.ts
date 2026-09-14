import { type DynamicModule, Module, type Provider } from '@nestjs/common'
import { PG_BOSS_METRICS_MODULE_OPTIONS, type PgbossMetricsModuleAsyncOptions } from './pgboss-metrics.module-options.js'
import { PgbossJobsCountMetric } from './pgboss-jobs-count.metric.js'
import { PgbossJobsWaitingSecondsMetric } from './pgboss-jobs-waiting-seconds.metric.js'

@Module({})
export class PgbossMetricsModule {
  static forRootAsync (options: PgbossMetricsModuleAsyncOptions): DynamicModule {
    return {
      module: PgbossMetricsModule,
      imports: options.imports ?? [],
      providers: [
        this.createAsyncOptionsProvider(options),
        PgbossJobsCountMetric,
        PgbossJobsWaitingSecondsMetric
      ]
    }
  }

  private static createAsyncOptionsProvider (options: PgbossMetricsModuleAsyncOptions): Provider {
    return {
      provide: PG_BOSS_METRICS_MODULE_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject ?? []
    }
  }
}
