import type {
  Payload,
  PayloadRequest,
} from 'payload'

import { isRecord } from './_kit'
import type {
  AfterSeedListener,
  SeedResult,
} from './types'

// A Symbol.for slot on globalThis is the decoupled cross-package channel (payload-revalidate
// registers here without importing us); Reflect reads/writes it without an untyped-global cast.
const AFTER_SEED_SLOT = Symbol.for('pro-laico.payload-seed.afterSeed')

export function registerAfterSeedListener(key: string, listener: AfterSeedListener): void {
  const existing = Reflect.get(globalThis, AFTER_SEED_SLOT)
  const listeners = isRecord(existing) ? existing : {}

  listeners[key] = listener
  Reflect.set(globalThis, AFTER_SEED_SLOT, listeners)
}

export function afterSeedListeners(): Record<string, unknown> {
  const existing = Reflect.get(globalThis, AFTER_SEED_SLOT)

  return isRecord(existing) ? existing : {}
}

export async function notifyAfterSeed(payload: Payload, req: PayloadRequest, result: SeedResult): Promise<void> {
  for (const [
    key,
    listener,
  ] of Object.entries(afterSeedListeners())) {
    if (typeof listener !== 'function') {
      continue
    }
    try {
      await listener(result, {
        payload,
        req,
      })
    }
    catch (error) {
      payload.logger.warn(`[payload-seed] afterSeed listener '${key}' failed: ${error instanceof Error ? error.message : String(error)}`)
    }
  }
}
