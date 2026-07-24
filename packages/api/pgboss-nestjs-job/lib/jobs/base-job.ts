import { JobInsert } from 'pg-boss'

type JobOptions = Omit<JobInsert, 'id' | 'name' | 'data'>
 
export abstract class BaseJob<T = object> {
  constructor (
    readonly data: T = {} as T,
    readonly options?: JobOptions
  ) {}
}
