import { Inject } from '@nestjs/common'
import { JwtVerifier } from './jwt-verifier.js'

export const DEFAULT_JWT_VERIFIER_NAME = 'default'

export type JwtVerifierToken = string | typeof JwtVerifier

export function getJwtVerifierToken (name?: string): JwtVerifierToken {
  if (name == null || name === DEFAULT_JWT_VERIFIER_NAME) {
    return JwtVerifier
  }

  return `wisemen.jwt-verifier.${name}`
}

export function InjectJwtVerifier (name?: string): ParameterDecorator {
  return Inject(getJwtVerifierToken(name))
}
