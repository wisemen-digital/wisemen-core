import { before, describe, it } from 'node:test'

import type { Provider } from '@nestjs/common'
import { expect } from 'expect'
import { SignJWT, generateKeyPair, type CryptoKey } from 'jose'
import { InvalidOrExpiredTokenError } from './errors/invalid-or-expired-token.error.js'
import { JwtVerifier } from './jwt-verifier.js'
import { JwtVerifierModule } from './jwt-verifier.module.js'
import { getJwtVerifierToken } from './jwt-verifier.tokens.js'
import type { JwtVerifierOptions } from './jwt-verifier.module-options.js'

let privateKey: CryptoKey
let publicKey: CryptoKey

describe('JwtVerifier unit tests', () => {
  const ISSUER = 'https://auth.test'
  const FIRST_AUDIENCE = 'application-one'
  const SECOND_AUDIENCE = 'application-two'

  before(async () => {
    const keyPair = await generateKeyPair('RS256')
    privateKey = keyPair.privateKey
    publicKey = keyPair.publicKey
  })

  it('accepts a token issued for the first configured audience', async () => {
    const verifier = createVerifier({
      audiences: [FIRST_AUDIENCE, SECOND_AUDIENCE],
      issuer: ISSUER,
      jwksEndpoint: ISSUER + '/oauth/v2/keys'
    })

    const token = await signToken(privateKey, {
      audience: FIRST_AUDIENCE,
      email: 'user@wisemen.digital',
      issuer: ISSUER,
      subject: 'user-id'
    })

    const result = await verifier.verify(token)

    expect(result).toMatchObject({
      sub: 'user-id',
      email: 'user@wisemen.digital'
    })
  })

  it('accepts a token issued for the second configured audience', async () => {
    const verifier = createVerifier({
      audiences: [FIRST_AUDIENCE, SECOND_AUDIENCE],
      issuer: ISSUER,
      jwksEndpoint: ISSUER + '/oauth/v2/keys'
    })

    const token = await signToken(privateKey, {
      audience: SECOND_AUDIENCE,
      email: 'user@wisemen.digital',
      issuer: ISSUER,
      subject: 'user-id'
    })

    const result = await verifier.verify(token)

    expect(result).toMatchObject({
      sub: 'user-id',
      email: 'user@wisemen.digital'
    })
  })

  it('rejects a token issued for an audience that is not configured', async () => {
    const verifier = createVerifier({
      audiences: [FIRST_AUDIENCE, SECOND_AUDIENCE],
      issuer: ISSUER,
      jwksEndpoint: ISSUER + '/oauth/v2/keys'
    })

    const token = await signToken(privateKey, {
      audience: 'unknown',
      email: 'user@wisemen.digital',
      issuer: ISSUER,
      subject: 'user-id'
    })

    await expect(verifier.verify(token)).rejects.toThrow(new InvalidOrExpiredTokenError())
  })

  it('accepts a token when a single audience is configured', async () => {
    const verifier = createVerifier({
      audiences: [FIRST_AUDIENCE],
      issuer: ISSUER,
      jwksEndpoint: ISSUER + '/oauth/v2/keys'
    })

    const token = await signToken(privateKey, {
      audience: FIRST_AUDIENCE,
      email: 'user@wisemen.digital',
      issuer: ISSUER,
      subject: 'user-id'
    })

    const result = await verifier.verify(token)

    expect(result).toMatchObject({ sub: 'user-id' })
  })

  it('rejects a token from another issuer', async () => {
    const verifier = createVerifier({
      audiences: [FIRST_AUDIENCE],
      issuer: ISSUER,
      jwksEndpoint: ISSUER + '/oauth/v2/keys'
    })

    const token = await signToken(privateKey, {
      audience: FIRST_AUDIENCE,
      email: 'user@wisemen.digital',
      issuer: 'https://attacker.test',
      subject: 'user-id'
    })

    await expect(verifier.verify(token)).rejects.toThrow(new InvalidOrExpiredTokenError())
  })

  it('uses the class token for the default Nest provider', () => {
    expect(getJwtVerifierToken()).toBe(JwtVerifier)
  })

  it('creates a named provider definition for forRoot', () => {
    const moduleDefinition = JwtVerifierModule.forRoot({
      audiences: [FIRST_AUDIENCE],
      issuer: ISSUER,
      jwksEndpoint: ISSUER + '/oauth/v2/keys',
      name: 'backoffice'
    })

    expect(moduleDefinition.exports).toContain(getJwtVerifierToken('backoffice'))

    const verifierProvider = findProvider(moduleDefinition.providers, getJwtVerifierToken('backoffice'))

    expect(verifierProvider).toBeDefined()
  })

  it('creates a named provider definition for forRootAsync', () => {
    const moduleDefinition = JwtVerifierModule.forRootAsync({
      imports: [],
      inject: [],
      name: 'portal',
      useFactory: (): JwtVerifierOptions => ({
        audiences: [FIRST_AUDIENCE],
        issuer: ISSUER,
        jwksEndpoint: ISSUER + '/oauth/v2/keys'
      })
    })

    expect(moduleDefinition.imports).toEqual([])
    expect(moduleDefinition.exports).toContain(getJwtVerifierToken('portal'))

    const verifierProvider = findProvider(moduleDefinition.providers, getJwtVerifierToken('portal'))

    expect(verifierProvider).toBeDefined()
  })
})

function createVerifier (options: JwtVerifierOptions): JwtVerifier {
  return new JwtVerifier(options, () => Promise.resolve(publicKey))
}

function findProvider (providers: Provider[] | undefined, token: unknown): Provider | undefined {
  return providers?.find(provider =>
    typeof provider === 'object'
    && provider !== null
    && 'provide' in provider
    && provider.provide === token
  )
}

async function signToken (
  privateKey: CryptoKey,
  options: {
    audience: string
    issuer: string
    subject: string
    email: string
  }
): Promise<string> {
  return await new SignJWT({ email: options.email })
    .setProtectedHeader({ alg: 'RS256' })
    .setIssuer(options.issuer)
    .setAudience(options.audience)
    .setSubject(options.subject)
    .setExpirationTime('5m')
    .sign(privateKey)
}
