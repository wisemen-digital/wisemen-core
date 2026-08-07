import { Injectable } from '@nestjs/common'
import { AsyncLocalStorage } from 'node:async_hooks'


interface PermifyContextValue {
  /** The permify tenant id*/
  tenantId: string

  /** The id of the `user` tuple in permify. (i.e. user:id) */
  userId: string
}

@Injectable()
export class PermifyContext {
  private storage = new AsyncLocalStorage<PermifyContextValue>()

  run(ctx: PermifyContextValue, cb: () => void): void {
    this.storage.run(ctx, cb)
  }

  getValueOrFail(): PermifyContextValue {
    const value = this.storage.getStore()
    
    if(value === undefined) {
      throw new Error('No permify context set')
    }

    return value
  }
}