import { Inject, Injectable, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common'
import { PgBoss } from 'pg-boss'
import { MODULE_OPTIONS_TOKEN } from './pgboss-client.module-definition.js'
import { PgBossClientModuleOptions } from './pgboss-client.module-options.js'

function defaultErrorHandler (e: Error) {
  // eslint-disable-next-line no-console
  console.error(e)
  process.exit(1)
}

@Injectable()
export class PgBossClient extends PgBoss implements OnModuleInit, OnModuleDestroy {
  constructor (
    @Inject(MODULE_OPTIONS_TOKEN) private options: PgBossClientModuleOptions
  ) {
    super(options.pgBossOptions)
  }

  async onModuleInit (): Promise<void> {
    await this.start()
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.on('error', this.options.onClientError ?? defaultErrorHandler)
  }

  async onModuleDestroy (): Promise<void> {
    await this.stop()
  }
}
