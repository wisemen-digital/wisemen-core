/**
 * Provider-independent category for a failed push send.
 *
 * Only {@link PushErrorCategory.UNREGISTERED} and {@link PushErrorCategory.INVALID_TOKEN}
 * describe the recipient registration itself. Every other category describes the payload,
 * our configuration or the provider, and must never disable a recipient registration.
 */
export enum PushErrorCategory {
  UNREGISTERED = 'unregistered',
  INVALID_TOKEN = 'invalid_token',
  INVALID_PAYLOAD = 'invalid_payload',
  CONFIGURATION = 'configuration',
  RATE_LIMITED = 'rate_limited',
  UNAVAILABLE = 'unavailable',
  INTERNAL = 'internal',
  NETWORK = 'network',
  UNKNOWN = 'unknown'
}

const RECIPIENT_ERROR_CATEGORIES: PushErrorCategory[] = [
  PushErrorCategory.UNREGISTERED,
  PushErrorCategory.INVALID_TOKEN
]

export function isRecipientErrorCategory (category: PushErrorCategory): boolean {
  return RECIPIENT_ERROR_CATEGORIES.includes(category)
}
