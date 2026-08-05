import type { FactoryProvider, ModuleMetadata } from '@nestjs/common'

/**
 * Runtime options used by a JWT verifier instance.
 */
export interface JwtVerifierOptions {
  /**
   * Expected issuer claim.
   */
  issuer: string

  /**
   * Accepted audience claims.
   */
  audiences: string[]

  /**
   * Remote JWKS endpoint used to resolve signing keys.
   */
  jwksEndpoint: string
}

/**
 * Static registration options for `JwtVerifierModule.forRoot(...)`.
 */
export interface JwtVerifierModuleOptions extends JwtVerifierOptions {
  /**
   * Optional verifier name used to register multiple instances in Nest DI.
   *
   * When omitted, the verifier is exported as the `JwtVerifier` class token.
   */
  name?: string
}

/**
 * Async registration options for `JwtVerifierModule.forRootAsync(...)`.
 */
export interface JwtVerifierModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  /**
   * Optional verifier name used to register multiple instances in Nest DI.
   */
  name?: string

  useFactory: (...args: unknown[]) => Promise<JwtVerifierOptions> | JwtVerifierOptions
  inject?: FactoryProvider['inject']
}

export type ResolvedJwtVerifierOptions = JwtVerifierOptions

export function resolveJwtVerifierOptions (
  options: JwtVerifierOptions
): ResolvedJwtVerifierOptions {
  if (options.audiences.length === 0) {
    throw new Error('audiences must contain at least one audience')
  }

  return {
    audiences: options.audiences,
    issuer: options.issuer,
    jwksEndpoint: options.jwksEndpoint
  }
}
