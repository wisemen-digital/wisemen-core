import { describe, it } from 'node:test'
import { expect } from 'expect'
import { generateUuid } from '@wisemen/nestjs-common'
import type { IdentityUuid } from './identity.uuid.js'
import { IdentityBuilder } from './identity.entity.builder.js'

describe('IdentityBuilder', () => {
  it('builds an identity with defaults', () => {
    const identity = new IdentityBuilder().build()

    expect(identity.uuid).toEqual(expect.any(String))
    expect(identity.createdAt).toBeInstanceOf(Date)
    expect(identity.updatedAt).toBeInstanceOf(Date)
    expect(identity.issuer).toBe('https://auth.example.test')
    expect(identity.subject).toEqual(expect.any(String))
    expect(identity.claims).toEqual({})
  })

  it('builds an identity with overridden values', () => {
    const uuid = generateUuid<IdentityUuid>()
    const createdAt = new Date('2025-01-01T00:00:00.000Z')
    const updatedAt = new Date('2025-01-02T00:00:00.000Z')
    const claims = { email: 'user@example.test' }
    const identity = new IdentityBuilder<typeof claims>()
      .withUuid(uuid)
      .withCreatedAt(createdAt)
      .withUpdatedAt(updatedAt)
      .withIssuer('https://issuer.example.test')
      .withSubject('user-123')
      .withClaims(claims)
      .build()

    expect(identity).toMatchObject({
      uuid,
      createdAt,
      updatedAt,
      issuer: 'https://issuer.example.test',
      subject: 'user-123',
      claims
    })
  })
})
