import { JobInsert } from 'pg-boss'

type Primitive = string | number | boolean | null | undefined
type Serializable = {
  [key: string | number | symbol]: Serializable | Serializable[] | Primitive | Primitive[]
}

export type BaseJobData = Serializable

export type BaseJobOptions = Omit<JobInsert, 'id' | 'name' | 'data'> & {
  /**
   * Opt this job into a rate limit by its key. The key must match one declared
   * in the worker's `rateLimits` config. The worker gates fetching and counts
   * usage for jobs carrying this key; it is serialized as the pg-boss group id.
   */
  rateLimited?: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export abstract class BaseJob<T extends BaseJobData = {}> {
  constructor (
    readonly data: T = {} as T,
    readonly options?: BaseJobOptions
  ) {}
}
