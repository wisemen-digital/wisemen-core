import { Injectable, Logger } from '@nestjs/common'
import type {
  AndroidConfig,
  ApnsConfig,
  BatchResponse,
  MulticastMessage,
  SendResponse
} from 'firebase-admin/messaging'
import { FirebaseMessagingGatewayPort } from './firebase-messaging.gateway-port.js'
import { classifyFirebaseError, readRetryAfterMs } from './map-firebase-error.js'
import type {
  PushMessage,
  PushProvider,
  PushSendOptions,
  PushSendOutcome,
  PushSendResult,
  PushTarget
} from '../provider/push-provider.types.js'
import { isRecipientErrorCategory, PushErrorCategory } from '../provider/push-error-category.js'
import { PushPriority } from '../provider/push-priority.js'
import { hashPushToken } from '../installation/push-token-hash.js'

/** The Firebase Admin SDK limits one multicast call to 500 targets. */
export const FCM_MULTICAST_BATCH_SIZE = 500

/** Bound concurrent calls so large audiences cannot create unbounded work. */
export const FCM_MAX_CONCURRENT_BATCHES = 4

/**
 * Firebase Cloud Messaging adapter.
 *
 * Sends visible notifications to one target directly and batches larger audiences. Data-only
 * background notifications need a separate payload and priority policy and are not supported.
 */
@Injectable()
export class FcmPushProvider implements PushProvider {
  public readonly name = 'fcm'

  private readonly logger = new Logger(FcmPushProvider.name)

  constructor (private readonly gateway: FirebaseMessagingGatewayPort) {}

  public async send (
    message: PushMessage,
    targets: PushTarget[],
    options: PushSendOptions = {}
  ): Promise<PushSendResult[]> {
    if (targets.length === 0) {
      return []
    }

    if (targets.length === 1) {
      return [await this.sendToSingleTarget(message, targets[0], options)]
    }

    const batches = chunk(targets, FCM_MULTICAST_BATCH_SIZE)
    const results: PushSendResult[] = []

    for (const group of chunk(batches, FCM_MAX_CONCURRENT_BATCHES)) {
      const groupResults = await Promise.all(
        group.map(async batch => await this.sendBatch(message, batch, options))
      )

      results.push(...groupResults.flat())
    }

    return results
  }

  private async sendToSingleTarget (
    message: PushMessage,
    target: PushTarget,
    options: PushSendOptions
  ): Promise<PushSendResult> {
    try {
      const messageId = await this.gateway.send({
        token: target.token,
        ...this.buildPayload(message)
      }, options.dryRun)

      return toResult(target, { status: 'accepted', messageId })
    } catch (error) {
      return toResult(target, this.classify(error, target))
    }
  }

  private async sendBatch (
    message: PushMessage,
    targets: PushTarget[],
    options: PushSendOptions
  ): Promise<PushSendResult[]> {
    const multicastMessage: MulticastMessage = {
      tokens: targets.map(target => target.token),
      ...this.buildPayload(message)
    }

    let response: BatchResponse

    try {
      response = await this.gateway.sendEachForMulticast(multicastMessage, options.dryRun)
    } catch (error) {
      // A batch-level failure cannot identify an invalid recipient.
      const outcome = demoteRecipientVerdict(this.classify(error, null))

      return targets.map(target => toResult(target, outcome))
    }

    return targets.map((target, index) => {
      const sendResponse: SendResponse | undefined = response.responses[index]

      if (sendResponse === undefined) {
        return toResult(target, {
          status: 'retryable',
          errorCategory: PushErrorCategory.UNKNOWN,
          retryAfterMs: null
        })
      }

      if (sendResponse.success) {
        return toResult(target, {
          status: 'accepted',
          messageId: sendResponse.messageId ?? null
        })
      }

      return toResult(target, this.classify(sendResponse.error, target))
    })
  }

  private buildPayload (message: PushMessage): {
    notification: { title: string, body: string }
    data: Record<string, string>
    android: AndroidConfig
    apns: ApnsConfig
  } {
    return {
      notification: {
        title: message.title,
        body: message.body
      },
      data: message.data,
      android: {
        priority: toAndroidPriority(message.priority)
      },
      apns: {
        headers: {
          'apns-push-type': 'alert',
          'apns-priority': toApnsPriority(message.priority)
        }
      }
    }
  }

  private classify (error: unknown, target: PushTarget | null): PushSendOutcome {
    const { category, isRetryable } = classifyFirebaseError(error)

    // Registration tokens are credentials, so logs include only a short hash.
    this.logger.warn(
      `FCM send failed with category ${category}`
      + (target === null ? '' : ` for token ${hashPushToken(target.token).slice(0, 12)}`)
    )

    if (isRetryable) {
      return {
        status: 'retryable',
        errorCategory: category,
        retryAfterMs: readRetryAfterMs(error, new Date())
      }
    }

    return { status: 'permanently_failed', errorCategory: category }
  }
}

/**
 * Convert a batch-level recipient error to a retryable result so one failure cannot revoke every
 * installation in the batch. Other permanent errors keep their classification.
 */
function demoteRecipientVerdict (outcome: PushSendOutcome): PushSendOutcome {
  if (outcome.status === 'permanently_failed' && isRecipientErrorCategory(outcome.errorCategory)) {
    return { status: 'retryable', errorCategory: PushErrorCategory.UNKNOWN, retryAfterMs: null }
  }

  return outcome
}

function toResult (target: PushTarget, outcome: PushSendOutcome): PushSendResult {
  return {
    installationUuid: target.installationUuid,
    userUuid: target.userUuid,
    sentTokenGeneration: target.tokenGeneration,
    outcome
  }
}

export function toAndroidPriority (priority: number): 'high' | 'normal' {
  return priority >= PushPriority.HIGH ? 'high' : 'normal'
}

export function toApnsPriority (priority: number): string {
  return priority >= PushPriority.HIGH ? '10' : '5'
}

function chunk<T> (items: T[], size: number): T[][] {
  const chunks: T[][] = []

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size))
  }

  return chunks
}
