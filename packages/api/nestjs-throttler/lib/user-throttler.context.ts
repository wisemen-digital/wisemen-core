import { Injectable } from '@nestjs/common'
import { AsyncLocalStorage } from 'node:async_hooks'

interface UserThrottlerContextValue {
  id: string
}

@Injectable()
export class UserThrottlerContext {
  private ctx: AsyncLocalStorage<UserThrottlerContextValue> = new AsyncLocalStorage()
  
  run(ctx: UserThrottlerContextValue, cb: () => void): void {
    this.ctx.run(ctx, cb)
  }

  getUserId(): string | undefined {
    return this.ctx.getStore()?.id
  }
}