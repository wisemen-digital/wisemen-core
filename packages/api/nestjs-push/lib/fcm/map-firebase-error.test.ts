import { describe, it } from 'node:test'
import { expect } from 'expect'
import { FirebaseMessagingError, MessagingErrorCode } from 'firebase-admin/messaging'
import { classifyFirebaseError, readRetryAfterMs } from './map-firebase-error.js'
import { PushErrorCategory } from '../provider/push-error-category.js'

function messagingError (code: MessagingErrorCode): FirebaseMessagingError {
  return new FirebaseMessagingError({ code, message: code })
}

describe('classifyFirebaseError', () => {
  it('treats a gone or malformed registration as a recipient problem', () => {
    expect(classifyFirebaseError(
      messagingError(MessagingErrorCode.REGISTRATION_TOKEN_NOT_REGISTERED)
    )).toEqual({ category: PushErrorCategory.UNREGISTERED, isRetryable: false })

    expect(classifyFirebaseError(
      messagingError(MessagingErrorCode.INVALID_REGISTRATION_TOKEN)
    )).toEqual({ category: PushErrorCategory.INVALID_TOKEN, isRetryable: false })
  })

  it('does not treat a generic invalid argument as an invalid registration', () => {
    expect(classifyFirebaseError(messagingError(MessagingErrorCode.INVALID_ARGUMENT)))
      .toEqual({ category: PushErrorCategory.INVALID_PAYLOAD, isRetryable: false })
  })

  it('recognises the malformed-token case FCM reports as an invalid argument', () => {
    // This is the message returned by FCM for a malformed token.
    const error = new FirebaseMessagingError({
      code: MessagingErrorCode.INVALID_ARGUMENT,
      message: 'The registration token is not a valid FCM registration token'
    })

    expect(classifyFirebaseError(error))
      .toEqual({ category: PushErrorCategory.INVALID_TOKEN, isRetryable: false })
  })

  it('keeps treating a reworded invalid argument as a payload problem', () => {
    const error = new FirebaseMessagingError({
      code: MessagingErrorCode.INVALID_ARGUMENT,
      message: 'Invalid value at "message.android.ttl"'
    })

    expect(classifyFirebaseError(error))
      .toEqual({ category: PushErrorCategory.INVALID_PAYLOAD, isRetryable: false })
  })

  it('never reads a payload-shaped invalid argument as a token problem', () => {
    const messages = [
      'Request contains an invalid argument: message is too big',
      'Invalid JSON payload received. Unknown name "gcm" at \'message.data\'',
      'Invalid value at "message.android.ttl" (TYPE_STRING)',
      'The registration is fine but the package name is not permitted'
    ]

    for (const message of messages) {
      expect(classifyFirebaseError(new FirebaseMessagingError({
        code: MessagingErrorCode.INVALID_ARGUMENT,
        message
      }))).toEqual({ category: PushErrorCategory.INVALID_PAYLOAD, isRetryable: false })
    }
  })

  it('does not let the token wording change the reading of an unrelated code', () => {
    const error = new FirebaseMessagingError({
      code: MessagingErrorCode.INTERNAL_ERROR,
      message: 'The registration token is not a valid FCM registration token'
    })

    expect(classifyFirebaseError(error))
      .toEqual({ category: PushErrorCategory.INTERNAL, isRetryable: true })
  })

  it('treats credentials and project mismatch as configuration failures', () => {
    const codes = [
      MessagingErrorCode.MISMATCHED_CREDENTIAL,
      MessagingErrorCode.AUTHENTICATION_ERROR,
      MessagingErrorCode.THIRD_PARTY_AUTH_ERROR
    ]

    for (const code of codes) {
      expect(classifyFirebaseError(messagingError(code))).toEqual({
        category: PushErrorCategory.CONFIGURATION,
        isRetryable: false
      })
    }
  })

  it('treats app level credential errors as configuration failures', () => {
    expect(classifyFirebaseError({ code: 'app/invalid-credential' })).toEqual({
      category: PushErrorCategory.CONFIGURATION,
      isRetryable: false
    })
  })

  it('retries rate limiting, unavailability, internal errors and unknown codes', () => {
    expect(classifyFirebaseError(messagingError(MessagingErrorCode.MESSAGE_RATE_EXCEEDED)))
      .toEqual({ category: PushErrorCategory.RATE_LIMITED, isRetryable: true })
    expect(classifyFirebaseError(messagingError(MessagingErrorCode.SERVER_UNAVAILABLE)))
      .toEqual({ category: PushErrorCategory.UNAVAILABLE, isRetryable: true })
    expect(classifyFirebaseError(messagingError(MessagingErrorCode.INTERNAL_ERROR)))
      .toEqual({ category: PushErrorCategory.INTERNAL, isRetryable: true })
    expect(classifyFirebaseError({ code: 'messaging/some-future-code' }))
      .toEqual({ category: PushErrorCategory.UNKNOWN, isRetryable: true })
  })

  it('treats an error without a code as a transport problem', () => {
    expect(classifyFirebaseError(new Error('socket hang up')))
      .toEqual({ category: PushErrorCategory.NETWORK, isRetryable: true })
  })
})

describe('readRetryAfterMs', () => {
  const now = new Date('2026-09-08T10:00:00.000Z')

  it('reads a delay in seconds', () => {
    const error = { httpResponse: { headers: { 'retry-after': '30' } } }

    expect(readRetryAfterMs(error, now)).toBe(30_000)
  })

  it('reads an absolute date', () => {
    const error = {
      httpResponse: { headers: { 'retry-after': 'Tue, 08 Sep 2026 10:01:00 GMT' } }
    }

    expect(readRetryAfterMs(error, now)).toBe(60_000)
  })

  it('returns null when the provider exposed no hint', () => {
    expect(readRetryAfterMs(new Error('nope'), now)).toBeNull()
    expect(readRetryAfterMs({ httpResponse: { headers: {} } }, now)).toBeNull()
  })
})
