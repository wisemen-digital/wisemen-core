import type {
  Payload,
  PayloadRequest,
} from 'payload'

import type { SeedResult } from './seedResult'

export type AfterSeedListener = (result: SeedResult, ctx: { payload: Payload
  req: PayloadRequest }) => Promise<void> | void
