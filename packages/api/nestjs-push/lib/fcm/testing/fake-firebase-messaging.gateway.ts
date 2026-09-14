import { Injectable } from '@nestjs/common'
import {
  type BatchResponse,
  FirebaseMessagingError,
  type Message,
  type MessagingErrorCode,
  type MulticastMessage,
  type SendResponse
} from 'firebase-admin/messaging'
import { FirebaseMessagingGatewayPort } from '../firebase-messaging.gateway-port.js'

export interface FakeTokenOutcome {
  /** Unprefixed messaging error code, for example `registration-token-not-registered`. */
  errorCode: MessagingErrorCode
  errorMessage?: string
}

/**
 * Controllable Firebase gateway for tests and local development. It records payloads and can
 * simulate per-token or whole-call failures without sending anything.
 */
@Injectable()
export class FakeFirebaseMessagingGateway extends FirebaseMessagingGatewayPort {
  public readonly sentMessages: Message[] = []
  public readonly sentMulticastMessages: MulticastMessage[] = []
  public readonly dryRuns: boolean[] = []
  public callCount = 0

  private readonly tokenOutcomes = new Map<string, FakeTokenOutcome>()
  private readonly callFailures: Error[] = []

  public reset (): void {
    this.sentMessages.length = 0
    this.sentMulticastMessages.length = 0
    this.callCount = 0
    this.dryRuns.length = 0
    this.tokenOutcomes.clear()
    this.callFailures.length = 0
  }

  /** Fail sends to this token until the fake is reset or the outcome is cleared. */
  public failToken (token: string, outcome: FakeTokenOutcome): void {
    this.tokenOutcomes.set(token, outcome)
  }

  public clearTokenOutcome (token: string): void {
    this.tokenOutcomes.delete(token)
  }

  /** Reject the next provider call. */
  public failNextCall (error: Error): void {
    this.callFailures.push(error)
  }

  public getSentTokenBatches (): string[][] {
    return this.sentMulticastMessages.map(message => [...message.tokens])
  }

  public async send (message: Message, dryRun = false): Promise<string> {
    this.callCount++
    this.throwIfCallShouldFail()
    this.sentMessages.push(message)
    this.dryRuns.push(dryRun)

    const token = 'token' in message ? message.token : ''
    const outcome = this.tokenOutcomes.get(token)

    if (outcome !== undefined) {
      throw createFakeFirebaseError(outcome)
    }

    return await Promise.resolve(`fake-message-id-${this.callCount}`)
  }

  public async sendEachForMulticast (
    message: MulticastMessage,
    dryRun = false
  ): Promise<BatchResponse> {
    this.callCount++
    this.throwIfCallShouldFail()
    this.sentMulticastMessages.push(message)
    this.dryRuns.push(dryRun)

    const responses: SendResponse[] = message.tokens.map((token, index) => {
      const outcome = this.tokenOutcomes.get(token)

      if (outcome !== undefined) {
        return { success: false, error: createFakeFirebaseError(outcome) }
      }

      return { success: true, messageId: `fake-message-id-${this.callCount}-${index}` }
    })

    return await Promise.resolve({
      responses,
      successCount: responses.filter(response => response.success).length,
      failureCount: responses.filter(response => !response.success).length
    })
  }

  private throwIfCallShouldFail (): void {
    const failure = this.callFailures.shift()

    if (failure !== undefined) {
      throw failure
    }
  }
}

/**
 * Use the Admin SDK error type so tests exercise production error classification.
 */
function createFakeFirebaseError (outcome: FakeTokenOutcome): FirebaseMessagingError {
  return new FirebaseMessagingError({
    code: outcome.errorCode,
    message: outcome.errorMessage ?? outcome.errorCode
  })
}
