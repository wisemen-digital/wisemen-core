import { Injectable } from '@nestjs/common'
import { UnauthorizedApiError } from '@wisemen/api-error'
import { AsyncLocalStorage } from 'async_hooks'
import { AuthenticatedPrincipal } from './principal/auth-principal.js'
import { NoAuthenticationContextError } from './errors/no-authentication-context.error.js'
import { setActiveSpanAttributes } from '@wisemen/opentelemetry'

@Injectable()
export class BearerAuthContext {
  private store = new AsyncLocalStorage<AuthenticatedPrincipal | UnauthorizedApiError>()

  getPrincipal (): AuthenticatedPrincipal | null {
    const auth = this.store.getStore()

    if (auth === undefined) {
      return null
    }

    if (auth instanceof UnauthorizedApiError) {
      return null
    }

    return auth
  }

  getPrincipalOrFail (): AuthenticatedPrincipal {
    const auth = this.store.getStore()

    if (auth === undefined) {
      throw new NoAuthenticationContextError()
    }

    if (auth instanceof UnauthorizedApiError) {
      throw auth
    }

    return auth
  }

  run (auth: AuthenticatedPrincipal, callback: () => void): void {
    this.setAuthTrace(auth)
    this.store.run(auth, callback)
  }

  runWithError (err: UnauthorizedApiError, cb: () => void): void {
    this.store.run(err, cb)
  }

  private setAuthTrace (auth: AuthenticatedPrincipal) {
    const attributes: Parameters<typeof setActiveSpanAttributes>[0] = {
      ['auth.type']: auth.type
    }

    if(auth.type === 'identity') {
      attributes['auth.sub'] = auth.subject
    } else if (auth.type === 'api-key') {
      attributes['auth.api-key'] = auth.uuid
    }

    setActiveSpanAttributes(attributes)
  }
}