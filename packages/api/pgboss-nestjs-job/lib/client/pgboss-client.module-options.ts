import { ConstructorOptions } from 'pg-boss'

export interface PgBossClientModuleOptions {
  pgBossOptions: ConstructorOptions
  onClientError?: (error: Error) => void
}
