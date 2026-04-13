import { BaseJob } from './base-job.js'

export abstract class JobHandler<T extends BaseJob = BaseJob> {
  abstract run (data: T['data']): Promise<void> | void
}
