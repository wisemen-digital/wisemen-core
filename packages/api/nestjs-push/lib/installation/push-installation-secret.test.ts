import { randomBytes } from 'node:crypto'
import { describe, it } from 'node:test'
import { expect } from 'expect'
import {
  hashInstallationSecret,
  installationSecretMatches,
  SECRET_HASH_LENGTH_IN_BYTES
} from './push-installation-secret.js'

const secret = randomBytes(SECRET_HASH_LENGTH_IN_BYTES).toString('hex')

describe('hashInstallationSecret', () => {
  it('never returns the secret itself', () => {
    const hash = hashInstallationSecret(secret)

    expect(hash).not.toBe(secret)
    expect(hash).toHaveLength(64)
    expect(hash).toMatch(/^[0-9a-f]{64}$/)
  })

  it('is stable for the same secret and different for another', () => {
    expect(hashInstallationSecret(secret)).toBe(hashInstallationSecret(secret))
    expect(hashInstallationSecret(secret))
      .not.toBe(hashInstallationSecret(randomBytes(32).toString('hex')))
  })
})

describe('installationSecretMatches', () => {
  it('accepts the secret it was derived from', () => {
    expect(installationSecretMatches(secret, hashInstallationSecret(secret))).toBe(true)
  })

  it('rejects a different secret', () => {
    const other = randomBytes(32).toString('hex')

    expect(installationSecretMatches(other, hashInstallationSecret(secret))).toBe(false)
  })

  it('rejects a secret that only shares a prefix', () => {
    const stored = hashInstallationSecret(secret)

    expect(installationSecretMatches(secret.slice(0, -1), stored)).toBe(false)
    expect(installationSecretMatches(`${secret}x`, stored)).toBe(false)
  })

  it('fails closed when there is nothing to compare against', () => {
    expect(installationSecretMatches(secret, undefined)).toBe(false)
    expect(installationSecretMatches(secret, null)).toBe(false)
    expect(installationSecretMatches(secret, '')).toBe(false)
  })

  it('fails closed on an empty secret or a malformed stored hash', () => {
    expect(installationSecretMatches('', hashInstallationSecret(''))).toBe(false)
    expect(installationSecretMatches(secret, 'not-a-hash')).toBe(false)
    expect(installationSecretMatches(secret, hashInstallationSecret(secret).slice(0, 32)))
      .toBe(false)
  })
})
