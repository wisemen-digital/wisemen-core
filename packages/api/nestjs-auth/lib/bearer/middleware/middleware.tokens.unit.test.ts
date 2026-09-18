import 'reflect-metadata'
import { describe, it } from 'node:test'
import { SELF_DECLARED_DEPS_METADATA } from '@nestjs/common/constants.js'
import { expect } from 'expect'
import { getAuthenticatorToken } from '../authenticator/authenticator.tokens.js'
import { BearerAuthMiddleware } from './bearer-auth.middleware.js'
import {
  getMiddlewareToken,
  InjectAuthMiddleware,
  InjectDynamicAuthMiddleware
} from './middleware.tokens.js'

describe('InjectAuthMiddleware', () => {
  it('declares a dependency on the trust its middleware token, not its authenticator', () => {
    class Consumer {}

    InjectAuthMiddleware('backoffice')(Consumer, undefined, 0)

    expect(declaredDependencies(Consumer)).toEqual([
      { index: 0, param: getMiddlewareToken('backoffice') }
    ])
    expect(declaredDependencies(Consumer)).not.toContainEqual(
      { index: 0, param: getAuthenticatorToken('backoffice') }
    )
  })
})

describe('InjectDynamicAuthMiddleware', () => {
  it('declares a dependency on the dynamic bearer middleware', () => {
    class Consumer {}

    InjectDynamicAuthMiddleware()(Consumer, undefined, 0)

    expect(declaredDependencies(Consumer)).toEqual([
      { index: 0, param: BearerAuthMiddleware }
    ])
  })
})

interface DeclaredDependency {
  index: number
  param: unknown
}

function declaredDependencies (target: object): DeclaredDependency[] {
  const dependencies = Reflect.getMetadata(
    SELF_DECLARED_DEPS_METADATA,
    target
  ) as DeclaredDependency[] | undefined

  return dependencies ?? []
}
