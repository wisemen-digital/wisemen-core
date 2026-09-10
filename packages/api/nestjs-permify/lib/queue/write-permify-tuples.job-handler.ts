import { Inject, Injectable } from '@nestjs/common'
import { JobHandler } from '@wisemen/pgboss-nestjs-job'
import type { PermifyClient } from '../permify.client.js'
import { PERMIFY_QUEUE_CLIENT } from './permify-queue.constants.js'
import { type WritePermifyTuplesJobData, WritePermifyTuplesJob } from './write-permify-tuples.job.js'

@Injectable()
export class WritePermifyTuplesJobHandler extends JobHandler<WritePermifyTuplesJob> {
  constructor (
    @Inject(PERMIFY_QUEUE_CLIENT) private permifyClient: PermifyClient
  ) {
    super()
  }

  async run (data: WritePermifyTuplesJobData): Promise<void> {
    for (const attribute of data.attributes ?? []) {
      if(attribute.value?.value !== undefined) {
        attribute.value.value = Buffer.from(attribute.value.value)
      } 
    }

    await this.permifyClient.data.write(data)
  }
}
