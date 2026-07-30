import type {
  Payload,
  PayloadRequest,
} from 'payload'

import type { SeedDefinition } from '#types/definitions/definitions'

import type { ResolvedSeedOptions } from './options'

export interface RunSeedArgs {
  definitions?: SeedDefinition[]
  options: ResolvedSeedOptions
  payload: Payload
  req: PayloadRequest
}
