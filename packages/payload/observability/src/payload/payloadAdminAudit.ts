import {
  audit,
  auditDiff,
  auditRedactPreset,
} from 'evlog'
import type {
  Config,
  PayloadRequest,
  Plugin,
} from 'payload'

import { limitLoggingValue } from '#logging/logging.ts'

export interface PayloadAdminAuditOptions {
  /**
   * Return false to skip a request. By default, only authenticated HTTP
   * requests are audited; local API calls from jobs, seeders, and hooks are not.
   */
  shouldAudit?: (req: PayloadRequest) => boolean
}

/**
 * Audit successful Payload CMS mutations made by authenticated users.
 *
 * Covers create, update, and delete operations on every collection, global
 * updates, and successful collection-auth logins/logouts. Events are emitted
 * through Evlog's audit helper, so an `auditDrain` receives them automatically.
 */
export function payloadAdminAudit(options: PayloadAdminAuditOptions = {}): Plugin {
  const shouldAudit = options.shouldAudit ?? isAuthenticatedHttpRequest

  return (config) => ({
    ...config,
    collections: config.collections?.map((collection) => ({
      ...collection,
      hooks: {
        ...collection.hooks,
        afterChange: [
          ...(collection.hooks?.afterChange ?? []),
          ({
            doc,
            operation,
            previousDoc,
            req,
          }) => {
            if (shouldAudit(req)) {
              emitAudit({
                action: `payload.collection.${collection.slug}.${operation}`,
                after: doc,
                before: operation === 'create' ? undefined : previousDoc,
                req,
                target: {
                  id: String(doc.id),
                  type: collection.slug,
                },
              })
            }

            return doc
          },
        ],
        afterDelete: [
          ...(collection.hooks?.afterDelete ?? []),
          ({
            doc, req,
          }) => {
            if (shouldAudit(req)) {
              emitAudit({
                action: `payload.collection.${collection.slug}.delete`,
                before: doc,
                req,
                target: {
                  id: String(doc.id),
                  type: collection.slug,
                },
              })
            }

            return doc
          },
        ],
        afterLogin: collection.auth
          ? [
              ...(collection.hooks?.afterLogin ?? []),
              ({
                req, user,
              }) => {
                if (shouldAudit({
                  ...req,
                  user,
                })) {
                  emitAudit({
                    action: `payload.collection.${collection.slug}.login`,
                    req,
                    target: {
                      id: String(user.id),
                      type: collection.slug,
                    },
                    user,
                  })
                }

                return user
              },
            ]
          : collection.hooks?.afterLogin,
        afterLogout: collection.auth
          ? [
              ...(collection.hooks?.afterLogout ?? []),
              ({
                req,
              }) => {
                if (shouldAudit(req)) {
                  emitAudit({
                    action: `payload.collection.${collection.slug}.logout`,
                    req,
                    target: {
                      id: String(req.user?.id),
                      type: collection.slug,
                    },
                  })
                }
              },
            ]
          : collection.hooks?.afterLogout,
      },
    })),
    globals: config.globals?.map((global) => ({
      ...global,
      hooks: {
        ...global.hooks,
        afterChange: [
          ...(global.hooks?.afterChange ?? []),
          ({
            doc,
            previousDoc,
            req,
          }) => {
            if (shouldAudit(req)) {
              emitAudit({
                action: `payload.global.${global.slug}.update`,
                after: doc,
                before: previousDoc,
                req,
                target: {
                  id: global.slug,
                  type: 'global',
                },
              })
            }

            return doc
          },
        ],
      },
    })),
  }) as Config
}

interface EmitAuditOptions {
  action: string
  after?: unknown
  before?: unknown
  req: PayloadRequest
  target: {
    id: string
    type: string
  }
  user?: PayloadRequest['user']
}

function emitAudit({
  action,
  after,
  before,
  req,
  target,
  user = req.user,
}: EmitAuditOptions): void {
  if (user == null) {
    return
  }

  audit({
    action,
    actor: {
      id: String(user.id),
      type: 'user',
    },
    changes: auditDiff(
      limitLoggingValue(before),
      limitLoggingValue(after),
      {
        redactPaths: auditRedactPreset.paths,
      },
    ),
    target,
  })
}

function isAuthenticatedHttpRequest(req: PayloadRequest): boolean {
  return req.user != null && req.payloadAPI !== 'local'
}
