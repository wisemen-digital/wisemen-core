import { AsyncLocalStorage } from 'node:async_hooks'

import type { AuditActor } from 'evlog'
import type { PayloadRequest } from 'payload'

const payloadAuditActorStorage = new AsyncLocalStorage<AuditActor>()

const anonymousActor: AuditActor = {
  id: 'anonymous',
  displayName: 'Anonymous request',
  type: 'api',
}

export const systemActor: AuditActor = {
  id: 'application',
  type: 'system',
}

/** Bind the current Payload request actor for normal Evlog application loggers. */
export function bindPayloadAuditActor(
  req: PayloadRequest,
  user: PayloadRequest['user'] = req.user,
): void {
  if (req.payloadAPI === 'local') {
    return
  }

  payloadAuditActorStorage.enterWith(user == null
    ? anonymousActor
    : {
        id: String(user.id),
        type: 'user',
      })
}

export function getPayloadAuditActor(): AuditActor | undefined {
  return payloadAuditActorStorage.getStore()
}
