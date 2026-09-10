import { BaseJob } from '@wisemen/pgboss-nestjs-job'
import type { PermifyClient } from '../permify.client.js'

export type WritePermifyTuplesJobData = Parameters<PermifyClient['data']['write']>[0]

export class WritePermifyTuplesJob extends BaseJob<WritePermifyTuplesJobData> {
  constructor (data: WritePermifyTuplesJobData) {
    super(data)
  }
}
