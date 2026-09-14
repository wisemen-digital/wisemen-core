import { createHash, timingSafeEqual } from 'node:crypto'

const SECRET_HASH_LENGTH_IN_BYTES = 32

/**
 * Hash an installation secret before storage.
 *
 * SHA-256 is appropriate here because clients generate random 256-bit secrets rather than
 * human-chosen passwords. The raw secret must never be stored, logged, or returned.
 */
export function hashInstallationSecret (secret: string): string {
  return createHash('sha256').update(secret, 'utf8').digest('hex')
}

/**
 * Compare a presented secret with its stored hash in constant time. Missing or malformed hashes
 * never match.
 */
export function installationSecretMatches (
  secret: string,
  storedHash: string | null | undefined
): boolean {
  if (typeof storedHash !== 'string' || secret === '') {
    return false
  }

  const presented = Buffer.from(hashInstallationSecret(secret), 'hex')
  const stored = Buffer.from(storedHash, 'hex')

  if (presented.length !== SECRET_HASH_LENGTH_IN_BYTES
    || stored.length !== SECRET_HASH_LENGTH_IN_BYTES) {
    return false
  }

  return timingSafeEqual(presented, stored)
}
