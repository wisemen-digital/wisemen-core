export type PushProviderName = string
export const FCM_PROVIDER_NAME = 'fcm' as const
export const PUSH_PROVIDER = Symbol('PUSH_PROVIDER')

import type { PushErrorCategory } from '../provider/push-error-category.js'
import type { PushPlatform } from '../installation/push-platform.js'

export interface PushTarget {
  installationUuid: string
  userUuid: string
  token: string
  tokenGeneration: number
  platform: PushPlatform
}

/**
 * Provider-independent push message.
 *
 * `data` values are always strings. `title`/`body` are already rendered in the recipient's
 * language by the caller; adapters must not re-localize.
 */
export interface PushMessage {
  title: string
  body: string
  data: Record<string, string>
  /** Provider-independent priority mapped by each adapter. */
  priority: number
}

export type PushSendOutcome
  = | { status: 'accepted', messageId: string | null }
    | { status: 'permanently_failed', errorCategory: PushErrorCategory }
    | { status: 'retryable', errorCategory: PushErrorCategory, retryAfterMs: number | null }
    | { status: 'skipped', reason: string }

export interface PushSendOptions {
  /** Validate the request at the provider without delivering it. */
  dryRun?: boolean
}

export interface PushSendResult {
  installationUuid: string
  userUuid: string
  /** Generation of the token that was actually sent, so stale results can be recognised. */
  sentTokenGeneration: number
  outcome: PushSendOutcome
}

export interface PushProvider {
  readonly name: PushProviderName

  /**
   * Send one payload to a set of targets and return one result per target, in any order.
   * Implementations must never throw for a per-target failure; they classify it instead.
   */
  send: (
    message: PushMessage,
    targets: PushTarget[],
    options?: PushSendOptions
  ) => Promise<PushSendResult[]>
}
