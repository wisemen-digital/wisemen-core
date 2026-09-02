export {
  PermifyModule,
  type PermifyOptions,
  type PermifyModuleAsyncOptions
} from './permify.module.js'

export { PermifyContext } from './permify.context.js'
export { PermifyClient, createPermifyAccessTokenInterceptor } from './permify.client.js'
export { Permify } from './permify.js'

// Queues
export { PermifyQueueModule } from './queue/permify-queue.module.js'
export {
  type PermifyQueueModuleAsyncOptions,
  type PermifyQueueModuleOptions
} from './queue/permify-queue.module-options.js'
export {
  WritePermifySchemaJob,
  type WritePermifySchemaJobData
} from './queue/write-permify-schema.job.js'
export {
  WritePermifyTuplesJob,
  type WritePermifyTuplesJobData
} from './queue/write-permify-tuples.job.js'

export const DEFAULT_TENANT_ID = 't1'
