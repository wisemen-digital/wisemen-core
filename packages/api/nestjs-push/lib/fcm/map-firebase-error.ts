import { MessagingErrorCode } from 'firebase-admin/messaging'
import { PushErrorCategory } from '../provider/push-error-category.js'

const MESSAGING_ERROR_PREFIX = 'messaging/'

/**
 * Errors that identify a missing or malformed registration. Only these errors can disable an
 * installation.
 */
const RECIPIENT_ERROR_CODES: Record<string, PushErrorCategory> = {
  [MessagingErrorCode.REGISTRATION_TOKEN_NOT_REGISTERED]: PushErrorCategory.UNREGISTERED,
  [MessagingErrorCode.INSTALLATION_ID_NOT_REGISTERED]: PushErrorCategory.UNREGISTERED,
  [MessagingErrorCode.INVALID_REGISTRATION_TOKEN]: PushErrorCategory.INVALID_TOKEN,
  [MessagingErrorCode.INVALID_RECIPIENT]: PushErrorCategory.INVALID_TOKEN
}

const PAYLOAD_ERROR_CODES: string[] = [
  MessagingErrorCode.INVALID_ARGUMENT,
  MessagingErrorCode.INVALID_PAYLOAD,
  MessagingErrorCode.INVALID_DATA_PAYLOAD_KEY,
  MessagingErrorCode.INVALID_OPTIONS,
  MessagingErrorCode.PAYLOAD_SIZE_LIMIT_EXCEEDED,
  MessagingErrorCode.INVALID_PACKAGE_NAME
]

/**
 * Configuration errors must never disable registrations. A wrong Firebase project, for example,
 * can return `MISMATCHED_CREDENTIAL` for every otherwise valid token.
 */
const CONFIGURATION_ERROR_CODES: string[] = [
  MessagingErrorCode.MISMATCHED_CREDENTIAL,
  MessagingErrorCode.AUTHENTICATION_ERROR,
  MessagingErrorCode.THIRD_PARTY_AUTH_ERROR
]

const RATE_LIMIT_ERROR_CODES: string[] = [
  MessagingErrorCode.MESSAGE_RATE_EXCEEDED,
  MessagingErrorCode.DEVICE_MESSAGE_RATE_EXCEEDED,
  MessagingErrorCode.TOPICS_MESSAGE_RATE_EXCEEDED
]

const UNAVAILABLE_ERROR_CODES: string[] = [
  MessagingErrorCode.SERVER_UNAVAILABLE
]

const INTERNAL_ERROR_CODES: string[] = [
  MessagingErrorCode.INTERNAL_ERROR
]

export interface FirebaseErrorClassification {
  category: PushErrorCategory
  isRetryable: boolean
}

/**
 * Classify an error from the Admin SDK into a sanitized category and a retry decision.
 *
 * Unknown codes are retryable because the SDK also uses `messaging/unknown-error` for transport
 * failures. The dispatch retry budget limits repeated attempts.
 */
export function classifyFirebaseError (error: unknown): FirebaseErrorClassification {
  const code = readErrorCode(error)

  if (code === null) {
    return { category: PushErrorCategory.NETWORK, isRetryable: true }
  }

  if (!code.startsWith(MESSAGING_ERROR_PREFIX)) {
    return { category: PushErrorCategory.CONFIGURATION, isRetryable: false }
  }

  const messagingCode = code.slice(MESSAGING_ERROR_PREFIX.length)
  const recipientCategory = RECIPIENT_ERROR_CODES[messagingCode]

  if (recipientCategory !== undefined) {
    return { category: recipientCategory, isRetryable: false }
  }

  if (PAYLOAD_ERROR_CODES.includes(messagingCode)) {
    if (isMalformedTokenMessage(readErrorMessage(error))) {
      return { category: PushErrorCategory.INVALID_TOKEN, isRetryable: false }
    }

    return { category: PushErrorCategory.INVALID_PAYLOAD, isRetryable: false }
  }

  if (CONFIGURATION_ERROR_CODES.includes(messagingCode)) {
    return { category: PushErrorCategory.CONFIGURATION, isRetryable: false }
  }

  if (RATE_LIMIT_ERROR_CODES.includes(messagingCode)) {
    return { category: PushErrorCategory.RATE_LIMITED, isRetryable: true }
  }

  if (UNAVAILABLE_ERROR_CODES.includes(messagingCode)) {
    return { category: PushErrorCategory.UNAVAILABLE, isRetryable: true }
  }

  if (INTERNAL_ERROR_CODES.includes(messagingCode)) {
    return { category: PushErrorCategory.INTERNAL, isRetryable: true }
  }

  return { category: PushErrorCategory.UNKNOWN, isRetryable: true }
}

/**
 * FCM uses `invalid-argument` for both malformed tokens and invalid payloads. The SDK exposes no
 * structured distinction, so only the known token-specific message is treated as a token error.
 */
function isMalformedTokenMessage (message: string | null): boolean {
  return message !== null && /not a valid fcm registration token/i.test(message)
}

/**
 * Read the provider's `Retry-After` header as milliseconds.
 */
export function readRetryAfterMs (error: unknown, now: Date): number | null {
  const headers = readResponseHeaders(error)
  const retryAfter = headers?.['retry-after'] ?? headers?.['Retry-After']

  if (typeof retryAfter !== 'string' || retryAfter === '') {
    return null
  }

  const seconds = Number(retryAfter)

  if (Number.isFinite(seconds)) {
    return Math.max(0, seconds * 1000)
  }

  const retryAt = Date.parse(retryAfter)

  if (Number.isNaN(retryAt)) {
    return null
  }

  return Math.max(0, retryAt - now.getTime())
}

function readErrorMessage (error: unknown): string | null {
  if (typeof error !== 'object' || error === null) {
    return null
  }

  const message = (error as { message?: unknown }).message

  return typeof message === 'string' ? message : null
}

function readErrorCode (error: unknown): string | null {
  if (typeof error !== 'object' || error === null) {
    return null
  }

  const code = (error as { code?: unknown }).code

  return typeof code === 'string' ? code : null
}

function readResponseHeaders (error: unknown): Record<string, string> | null {
  if (typeof error !== 'object' || error === null) {
    return null
  }

  const httpResponse = (error as { httpResponse?: { headers?: unknown } }).httpResponse
  const headers = httpResponse?.headers

  if (typeof headers !== 'object' || headers === null) {
    return null
  }

  return headers as Record<string, string>
}
