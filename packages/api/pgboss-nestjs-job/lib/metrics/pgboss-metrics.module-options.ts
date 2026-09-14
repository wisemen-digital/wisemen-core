import type { FactoryProvider, ModuleMetadata } from '@nestjs/common'
import type { DataSource } from 'typeorm'

export const PG_BOSS_METRICS_MODULE_OPTIONS = Symbol('wisemen.pg-boss-metrics.module-options')

export interface PgbossMetricsModuleOptions {
  queueNames: string[]
  dataSource: DataSource
}

export interface PgbossMetricsModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (...args: unknown[]) => Promise<PgbossMetricsModuleOptions> | PgbossMetricsModuleOptions
  inject?: FactoryProvider['inject']
}
