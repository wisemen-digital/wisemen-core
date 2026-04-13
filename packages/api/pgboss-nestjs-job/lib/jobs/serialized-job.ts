import { JobInsert } from 'pg-boss'
import { BaseJob } from './base-job.js'
import { TraceContextCarrier } from './trace-context-carrier.js'

interface SerializedJobData<T extends BaseJob> {
  className: string
  classData: T['data']
  traceContext?: TraceContextCarrier
}

export interface SerializedJob<T extends BaseJob = BaseJob>
  extends JobInsert<SerializedJobData<T>> {
  name: string
}
