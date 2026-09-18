import { Module, type DynamicModule, type FactoryProvider, type Provider } from '@nestjs/common'
import { createJwtVerifier, JwtVerifier } from './jwt-verifier.js'
import { DEFAULT_JWT_VERIFIER_NAME, getJwtVerifierToken } from './jwt-verifier.tokens.js'
import {
  resolveJwtVerifierOptions,
  type JwtVerifierModuleAsyncOptions,
  type JwtVerifierModuleOptions,
  type ResolvedJwtVerifierOptions
} from './jwt-verifier.module-options.js'

@Module({})
export class JwtVerifierModule {
  static register (options: JwtVerifierModuleOptions): DynamicModule {
    const optionsProvider: Provider = {
      provide: getJwtVerifierOptionsToken(options.name),
      useValue: resolveJwtVerifierOptions(options)
    }

    return createJwtVerifierModuleDefinition(options.name, [optionsProvider])
  }

  static registerAsync (options: JwtVerifierModuleAsyncOptions): DynamicModule {
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
  const verifierToken = getJwtVerifierToken(name)

  return {
    module: JwtVerifierModule,
    providers: [
      ...providers,
      {
        provide: verifierToken,
        inject: [optionsToken],
        useFactory: (options: ResolvedJwtVerifierOptions): JwtVerifier => createJwtVerifier(options)
      }
    ],
    exports: [verifierToken]
  }
}

function getJwtVerifierOptionsToken (name?: string): string {
  return `wisemen.jwt-verifier.options.${name ?? DEFAULT_JWT_VERIFIER_NAME}`
}
