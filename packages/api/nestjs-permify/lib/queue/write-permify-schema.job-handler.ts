import { Inject, Injectable } from '@nestjs/common'
import { JobHandler } from '@wisemen/pgboss-nestjs-job'
import type { PermifyClient } from '../permify.client.js'
import { PERMIFY_QUEUE_CLIENT } from './permify-queue.constants.js'
import { type WritePermifySchemaJobData, WritePermifySchemaJob } from './write-permify-schema.job.js'

@Injectable()
export class WritePermifySchemaJobHandler extends JobHandler<WritePermifySchemaJob> {
  constructor (
    @Inject(PERMIFY_QUEUE_CLIENT) private permifyClient: PermifyClient
  ) {
    super()
  }

  async run (data: WritePermifySchemaJobData): Promise<void> {
    await this.permifyClient.schema.write(data)
  }
}
