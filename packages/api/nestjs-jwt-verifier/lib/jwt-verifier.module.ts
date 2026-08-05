import { Module, type DynamicModule, type FactoryProvider, type Provider } from '@nestjs/common'
import { createRemoteJWKSet, type JWTVerifyGetKey } from 'jose'
import { JwtVerifier } from './jwt-verifier.js'
import { DEFAULT_JWT_VERIFIER_NAME, getJwtVerifierToken } from './jwt-verifier.tokens.js'
import {
  resolveJwtVerifierOptions,
  type JwtVerifierModuleAsyncOptions,
  type JwtVerifierModuleOptions,
  type ResolvedJwtVerifierOptions
} from './jwt-verifier.module-options.js'

@Module({})
export class JwtVerifierModule {
  static forRoot (options: JwtVerifierModuleOptions): DynamicModule {
    const optionsProvider: Provider = {
      provide: getJwtVerifierOptionsToken(options.name),
      useValue: resolveJwtVerifierOptions(options)
    }

    return createJwtVerifierModuleDefinition(options.name, [optionsProvider])
  }

  static forRootAsync (options: JwtVerifierModuleAsyncOptions): DynamicModule {
    const optionsProvider: FactoryProvider<Promise<ResolvedJwtVerifierOptions> | ResolvedJwtVerifierOptions> = {
      provide: getJwtVerifierOptionsToken(options.name),
      inject: options.inject ?? [],
      useFactory: async (...args: unknown[]) => {
        const moduleOptions = await options.useFactory(...args)

        return resolveJwtVerifierOptions(moduleOptions)
      }
    }

    return {
      ...createJwtVerifierModuleDefinition(options.name, [optionsProvider]),
      imports: options.imports
    }
  }
}

function createJwtVerifierModuleDefinition (
  name: string | undefined,
  providers: Provider[]
): DynamicModule {
  const optionsToken = getJwtVerifierOptionsToken(name)
  const jwkSetToken = getJwtVerifierJwkSetToken(name)
  const verifierToken = getJwtVerifierToken(name)

  return {
    module: JwtVerifierModule,
    providers: [
      ...providers,
      {
        provide: jwkSetToken,
        inject: [optionsToken],
        useFactory: (options: ResolvedJwtVerifierOptions): JWTVerifyGetKey =>
          createRemoteJWKSet(new URL(options.jwksEndpoint))
      },
      {
        provide: verifierToken,
        inject: [optionsToken, jwkSetToken],
        useFactory: (
          options: ResolvedJwtVerifierOptions,
          jwkSet: JWTVerifyGetKey
        ): JwtVerifier => new JwtVerifier(options, jwkSet)
      }
    ],
    exports: [verifierToken]
  }
}

function getJwtVerifierJwkSetToken (name?: string): string {
  return `wisemen.jwt-verifier.jwk-set.${name ?? DEFAULT_JWT_VERIFIER_NAME}`
}

function getJwtVerifierOptionsToken (name?: string): string {
  return `wisemen.jwt-verifier.options.${name ?? DEFAULT_JWT_VERIFIER_NAME}`
}
