import { BaseJob } from '../jobs/base-job.js'

/** The rate-limit key a job opted into, used as its pg-boss group id. */
export function resolveGroupId (job: BaseJob): string | undefined {
  return job.options?.rateLimited
}
