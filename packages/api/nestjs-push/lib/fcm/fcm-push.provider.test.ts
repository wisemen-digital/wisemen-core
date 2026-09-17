import { describe, it, mock } from 'node:test'
import { Logger } from '@nestjs/common'
import { expect } from 'expect'
import { type BatchResponse, FirebaseMessagingError, MessagingErrorCode } from 'firebase-admin/messaging'
import { FakeFirebaseMessagingGateway } from './testing/fake-firebase-messaging.gateway.js'
import { FirebaseMessagingGatewayPort } from './firebase-messaging.gateway-port.js'
import {
  FCM_MULTICAST_BATCH_SIZE,
  FcmPushProvider,
  toAndroidPriority,
  toApnsPriority
} from './fcm-push.provider.js'
import { PushErrorCategory } from '../provider/push-error-category.js'
import { PushPlatform } from '../installation/push-platform.js'
import { PushPriority } from '../provider/push-priority.js'
import type {
  PushMessage,
  PushTarget
} from '../provider/push-provider.types.js'

function createTarget (index: number): PushTarget {
  return {
    installationUuid: `installation-${index}`,
    userUuid: `user-${index}`,
    token: `token-${index}`,
    tokenGeneration: 1,
    platform: PushPlatform.ANDROID
  }
}

function createMessage (priority: number = PushPriority.MEDIUM): PushMessage {
  return {
    title: 'Nieuw document',
    body: 'Loonbrief maart',
    data: { type: 'document', eventId: 'event-1' },
    priority
  }
}

function createProvider (): { provider: FcmPushProvider, gateway: FakeFirebaseMessagingGateway } {
  const gateway = new FakeFirebaseMessagingGateway()

  return { provider: new FcmPushProvider(gateway), gateway }
}

class UninitializableGateway extends FirebaseMessagingGatewayPort {
  public send (): Promise<string> {
    throw Object.assign(new Error('Failed to load application default credentials'), {
      code: 'app/invalid-credential'
    })
  }

  public sendEachForMulticast (): Promise<BatchResponse> {
    throw Object.assign(new Error('Failed to load application default credentials'), {
      code: 'app/invalid-credential'
    })
  }
}

describe('FcmPushProvider', () => {
  it('sends a single target through send() with the notification and string data', async () => {
    const { provider, gateway } = createProvider()

    const results = await provider.send(createMessage(), [createTarget(1)])

    expect(gateway.sentMessages).toHaveLength(1)
    expect(gateway.sentMulticastMessages).toHaveLength(0)

    const [sent] = gateway.sentMessages

    expect(sent).toMatchObject({
      token: 'token-1',
      notification: { title: 'Nieuw document', body: 'Loonbrief maart' },
      data: { type: 'document', eventId: 'event-1' }
    })
    expect(results[0].outcome).toEqual({ status: 'accepted', messageId: 'fake-message-id-1' })
  })

  it('maps the domain priorities onto Android and APNs transport priorities', () => {
    expect(toAndroidPriority(PushPriority.LOW)).toBe('normal')
    expect(toAndroidPriority(PushPriority.MEDIUM)).toBe('normal')
    expect(toAndroidPriority(PushPriority.HIGH)).toBe('high')

    expect(toApnsPriority(PushPriority.LOW)).toBe('5')
    expect(toApnsPriority(PushPriority.MEDIUM)).toBe('5')
    expect(toApnsPriority(PushPriority.HIGH)).toBe('10')
  })

  it('sends visible alerts with the alert push type on APNs', async () => {
    const { provider, gateway } = createProvider()

    await provider.send(createMessage(PushPriority.HIGH), [createTarget(1)])

    expect(gateway.sentMessages[0].apns?.headers).toEqual({
      'apns-push-type': 'alert',
      'apns-priority': '10'
    })
    expect(gateway.sentMessages[0].android?.priority).toBe('high')
  })

  it('sets no sounds, badges, channels, images or ttl', async () => {
    const { provider, gateway } = createProvider()

    await provider.send(createMessage(), [createTarget(1)])

    const [sent] = gateway.sentMessages

    expect(sent.android?.ttl).toBeUndefined()
    expect(sent.android?.notification).toBeUndefined()
    expect(sent.apns?.payload).toBeUndefined()
    expect(Object.keys(sent.notification ?? {})).toEqual(['title', 'body'])
  })

  it('does nothing for an empty target list', async () => {
    const { provider, gateway } = createProvider()

    const results = await provider.send(createMessage(), [])

    expect(results).toEqual([])
    expect(gateway.callCount).toBe(0)
  })

  it('splits an audience into multicast batches of at most 500 tokens', async () => {
    const { provider, gateway } = createProvider()
    const targets = Array.from({ length: 1201 }, (_, index) => createTarget(index))

    const results = await provider.send(createMessage(), targets)

    const batches = gateway.getSentTokenBatches()

    expect(batches.map(batch => batch.length)).toEqual([
      FCM_MULTICAST_BATCH_SIZE,
      FCM_MULTICAST_BATCH_SIZE,
      201
    ])
    expect(results).toHaveLength(1201)
    expect(results.every(result => result.outcome.status === 'accepted')).toBe(true)
  })

  it('returns one result per target for a mixed batch', async () => {
    const { provider, gateway } = createProvider()
    const targets = [createTarget(1), createTarget(2), createTarget(3)]

    gateway.failToken('token-2', {
      errorCode: MessagingErrorCode.REGISTRATION_TOKEN_NOT_REGISTERED
    })
    gateway.failToken('token-3', { errorCode: MessagingErrorCode.SERVER_UNAVAILABLE })

    const results = await provider.send(createMessage(), targets)
    const byInstallation = new Map(results.map(result => [result.installationUuid, result.outcome]))

    expect(byInstallation.get('installation-1')?.status).toBe('accepted')
    expect(byInstallation.get('installation-2')).toEqual({
      status: 'permanently_failed',
      errorCategory: PushErrorCategory.UNREGISTERED
    })
    expect(byInstallation.get('installation-3')).toEqual({
      status: 'retryable',
      errorCategory: PushErrorCategory.UNAVAILABLE,
      retryAfterMs: null
    })
  })

  it('separates an invalid token from an invalid payload and from a configuration failure',
    async () => {
      const { provider, gateway } = createProvider()
      const targets = [createTarget(1), createTarget(2), createTarget(3)]

      gateway.failToken('token-1', {
        errorCode: MessagingErrorCode.INVALID_REGISTRATION_TOKEN
      })
      gateway.failToken('token-2', { errorCode: MessagingErrorCode.INVALID_ARGUMENT })
      gateway.failToken('token-3', { errorCode: MessagingErrorCode.MISMATCHED_CREDENTIAL })

      const results = await provider.send(createMessage(), targets)
      const categories = results.map(result =>
        result.outcome.status === 'permanently_failed' ? result.outcome.errorCategory : null
      )

      expect(categories).toEqual([
        PushErrorCategory.INVALID_TOKEN,
        PushErrorCategory.INVALID_PAYLOAD,
        PushErrorCategory.CONFIGURATION
      ])
    })

  it('classifies a whole-call failure as retryable for every target without judging the devices',
    async () => {
      const { provider, gateway } = createProvider()
      const targets = [createTarget(1), createTarget(2)]

      gateway.failNextCall(Object.assign(new Error('socket hang up'), { code: undefined }))

      const results = await provider.send(createMessage(), targets)

      expect(results.map(result => result.outcome)).toEqual([
        { status: 'retryable', errorCategory: PushErrorCategory.NETWORK, retryAfterMs: null },
        { status: 'retryable', errorCategory: PushErrorCategory.NETWORK, retryAfterMs: null }
      ])
    })

  it('never turns a whole-call failure into a recipient verdict on every device',
    async () => {
      const { provider, gateway } = createProvider()
      const targets = [createTarget(1), createTarget(2), createTarget(3)]

      gateway.failNextCall(new FirebaseMessagingError({
        code: MessagingErrorCode.INVALID_ARGUMENT,
        message: 'The registration token is not a valid FCM registration token'
      }))

      const results = await provider.send(createMessage(), targets)

      expect(results).toHaveLength(3)

      for (const result of results) {
        expect(result.outcome).toEqual({
          status: 'retryable',
          errorCategory: PushErrorCategory.UNKNOWN,
          retryAfterMs: null
        })
      }
    })

  it('keeps a whole-call configuration failure terminal', async () => {
    const { provider, gateway } = createProvider()
    const targets = [createTarget(1), createTarget(2)]

    gateway.failNextCall(new FirebaseMessagingError({
      code: MessagingErrorCode.MISMATCHED_CREDENTIAL,
      message: 'SenderId mismatch'
    }))

    const results = await provider.send(createMessage(), targets)

    for (const result of results) {
      expect(result.outcome).toEqual({
        status: 'permanently_failed',
        errorCategory: PushErrorCategory.CONFIGURATION
      })
    }
  })

  it('still attributes a recipient verdict on the single-target path', async () => {
    const { provider, gateway } = createProvider()

    gateway.failToken('token-1', {
      errorCode: MessagingErrorCode.INVALID_ARGUMENT,
      errorMessage: 'The registration token is not a valid FCM registration token'
    })

    const [result] = await provider.send(createMessage(), [createTarget(1)])

    expect(result.outcome).toEqual({
      status: 'permanently_failed',
      errorCategory: PushErrorCategory.INVALID_TOKEN
    })
  })

  it('returns classified results instead of rejecting when the gateway cannot initialize',
    async () => {
      const provider = new FcmPushProvider(new UninitializableGateway())
      const targets = Array.from({ length: 3 }, (_, index) => createTarget(index))

      const single = await provider.send(createMessage(), [createTarget(1)])
      const batched = await provider.send(createMessage(), targets)

      expect(single).toHaveLength(1)
      expect(batched).toHaveLength(3)

      for (const result of [...single, ...batched]) {
        expect(result.outcome).toEqual({
          status: 'permanently_failed',
          errorCategory: PushErrorCategory.CONFIGURATION
        })
      }
    })

  it('reports the generation of the token it actually sent', async () => {
    const { provider } = createProvider()
    const target = { ...createTarget(1), tokenGeneration: 7 }

    const results = await provider.send(createMessage(), [target])

    expect(results[0].sentTokenGeneration).toBe(7)
  })

  it('validates without delivering when a dry run is asked for', async () => {
    const { provider, gateway } = createProvider()

    await provider.send(createMessage(), [createTarget(1)], { dryRun: true })
    await provider.send(createMessage(), [createTarget(1), createTarget(2)], { dryRun: true })
    await provider.send(createMessage(), [createTarget(3)])

    expect(gateway.dryRuns).toEqual([true, true, false])
  })

  it('never writes a registration token or credential into a log line', async () => {
    const { provider, gateway } = createProvider()
    const logged: unknown[] = []
    const warn = mock.method(Logger.prototype, 'warn', (message: unknown) => {
      logged.push(message)
    })

    try {
      gateway.failToken('token-1', {
        errorCode: MessagingErrorCode.REGISTRATION_TOKEN_NOT_REGISTERED,
        errorMessage: 'token token-1 is not registered'
      })

      await provider.send(createMessage(), [createTarget(1)])
    } finally {
      warn.mock.restore()
    }

    expect(logged).toHaveLength(1)
    expect(String(logged[0])).not.toContain('token-1')
    expect(String(logged[0])).toContain(PushErrorCategory.UNREGISTERED)
  })
})
