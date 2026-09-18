import { describe, it } from 'node:test'
import { createHash } from 'node:crypto'
import { expect } from 'expect'
import { API_KEY_PREFIX } from '../constants.js'
import { ApiKeySecret } from './api-key-secret.js'

const KNOWN_SECRET = 'ak_0123456789abcdef'
const KNOWN_SECRET_HASH = 'dd09739912cc33012d3903a2e9de8473a1040fd1e5dbd61e9176072991b3006d'
const GENERATED_SECRET_LENGTH = API_KEY_PREFIX.length + 48
const LAST_CHARS_LENGTH = 5

describe('ApiKeySecret', () => {
  it('generates a prefixed secret of the expected length', () => {
    const secret = new ApiKeySecret()

    expect(secret.value.startsWith(API_KEY_PREFIX)).toBe(true)
    expect(secret.value).toHaveLength(GENERATED_SECRET_LENGTH)
    expect(secret.value.slice(API_KEY_PREFIX.length)).toMatch(/^[0-9a-f]+$/)
  })

  it('generates a different secret on every construction', () => {
    const secrets = new Set(Array.from({ length: 50 }, () => new ApiKeySecret().value))

    expect(secrets.size).toBe(50)
  })

  it('keeps an existing secret verbatim so a presented token can be looked up', () => {
    expect(new ApiKeySecret(KNOWN_SECRET).value).toBe(KNOWN_SECRET)
  })

  // The hash is the stored lookup key for every issued API key. Changing the
  // algorithm invalidates every key already in a consumer's database, so this
  // asserts a fixed digest rather than recomputing it the same way as the code.
  it('hashes a secret with a stable digest', () => {
    expect(new ApiKeySecret(KNOWN_SECRET).hash).toBe(KNOWN_SECRET_HASH)
  })

  it('derives the same hash the authenticator looks up for a generated secret', () => {
    const secret = new ApiKeySecret()
    const expected = createHash('sha256').update(secret.value).digest('hex')

    expect(secret.hash).toBe(expected)
    expect(secret.hash).toBe(secret.hash)
  })

  it('exposes only the trailing characters safe to persist alongside the hash', () => {
    const secret = new ApiKeySecret(KNOWN_SECRET)

    expect(secret.lastChars).toBe('bcdef')
    expect(secret.lastChars).toHaveLength(LAST_CHARS_LENGTH)
    expect(KNOWN_SECRET.endsWith(secret.lastChars)).toBe(true)
  })

  it('masks a secret down to its trailing characters', () => {
    const secret = new ApiKeySecret(KNOWN_SECRET)

    expect(secret.maskedValue.endsWith(secret.lastChars)).toBe(true)
    expect(secret.maskedValue).toMatch(/^\*+/)
    expect(ApiKeySecret.mask(KNOWN_SECRET)).toBe(secret.maskedValue)
  })
})
