import { BaseJob } from '@wisemen/pgboss-nestjs-job'
import type { PermifyClient } from '../permify.client.js'

export type WritePermifySchemaJobData = Parameters<PermifyClient['schema']['write']>[0]

export class WritePermifySchemaJob extends BaseJob<WritePermifySchemaJobData> {
  constructor (data: WritePermifySchemaJobData) {
    super(data)
  }
}
