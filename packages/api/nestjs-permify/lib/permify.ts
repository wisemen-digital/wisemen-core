import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { PermifyClient } from './permify.client.js'
import { PermifyContext } from './permify.context.js'
import { CheckResult } from '@permify/permify-node/dist/src/grpc/generated/base/v1/base.js'

export const PermifyDepth = Symbol('wisemen.permify-depth')

/** 
 * A wrapper around the a `PermifyClient` which is 
 * `PermifyContext` aware.
 */
@Injectable()
export class Permify {
  constructor (
    private client: PermifyClient,
    private context: PermifyContext,
    @Inject(PermifyDepth) private depth: number
  ) {}

  /**
   * Check whether the current user has access
   * @param permission the permission to check e.g. `read`
   * @param entity the entity to secure e.g. `document`
   * @param id the id of the entity e.g. `1`
   */
  async check (permission: string, entity: string, id: string): Promise<boolean> {
    const context = this.context.getValueOrFail()

    const checkResult = await this.client.permission.check({
      tenantId: context.tenantId,
      metadata: {
        depth: this.depth
      },
      subject: {
        type: 'user',
        id: context.userId
      },
      permission,
      entity: {
        id,
        type: entity
      }
    })

    return checkResult.can === CheckResult.CHECK_RESULT_ALLOWED
  }

  /**
   * Performs the `check` operator, but throws a `NotFoundException (404)`
   * when access is not allowed.
   */
  async checkOrFail (permission: string, entity: string, id: string): Promise<void> {
    const canAccess = await this.check(permission, entity, id)
    if(!canAccess) {
      throw new NotFoundException() 
    }
  }
}