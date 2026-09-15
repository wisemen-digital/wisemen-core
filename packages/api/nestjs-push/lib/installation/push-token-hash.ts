import { createHash } from 'node:crypto'

/**
 * Stable fingerprint of a registration token.
 *
 * Registration tokens are long and unbounded, so uniqueness is enforced on this hash instead
 * of on the token itself. The hash is also the only token derived value that may appear in
 * logs or error output.
 */
export function hashPushToken (token: string): string {
  return createHash('sha256').update(token, 'utf8').digest('hex')
}
