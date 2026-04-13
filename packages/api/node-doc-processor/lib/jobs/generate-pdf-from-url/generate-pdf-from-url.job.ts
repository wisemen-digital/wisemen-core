import { BaseJob, PgBossJob } from '@wisemen/pgboss-nestjs-job'
import { GeneratePdfFromUrlData } from './generate-pdf-from-url.data.js'
import { DOC_PROCESSOR_QUEUE_NAME } from '#src/types/queue-name.js'

@PgBossJob(DOC_PROCESSOR_QUEUE_NAME)
export class GeneratePdfFromUrlJob extends BaseJob<GeneratePdfFromUrlData> {}
