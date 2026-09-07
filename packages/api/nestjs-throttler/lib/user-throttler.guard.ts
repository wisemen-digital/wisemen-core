import { InjectThrottlerOptions, InjectThrottlerStorage, ThrottlerGuard } from '@nestjs/throttler'
import type { ThrottlerModuleOptions, ThrottlerStorage } from '@nestjs/throttler'
import { Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { UserThrottlerContext } from './user-throttler.context.js'

@Injectable()
export class UserThrottlerGuard extends ThrottlerGuard {
  constructor (
    @InjectThrottlerOptions() protected options: ThrottlerModuleOptions,
    @InjectThrottlerStorage() protected storageService: ThrottlerStorage,
    protected reflector: Reflector,
    private userContext: UserThrottlerContext,
  ) {
    super(options, storageService, reflector)
  }

  protected getTracker (req: Record<string, unknown>): Promise<string> {
    const userId = this.userContext.getUserId()

    if (userId != null) {
      return Promise.resolve(userId)
    } else {
      return super.getTracker(req)
    }
  }
}
