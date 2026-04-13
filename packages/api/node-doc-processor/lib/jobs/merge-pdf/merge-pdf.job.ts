import { BaseJob, PgBossJob } from '@wisemen/pgboss-nestjs-job'
import { MergePdfData } from './merge-pdf.data.js'
import { DOC_PROCESSOR_QUEUE_NAME } from '#src/types/queue-name.js'

@PgBossJob(DOC_PROCESSOR_QUEUE_NAME)
export class MergePdfJob extends BaseJob<MergePdfData> {}
