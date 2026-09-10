import type {
  Config,
  PayloadRequest,
  Plugin,
} from 'payload'

import { createApplicationLogger } from '#logging/logging.ts'
import { bindPayloadAuditActor } from '#payload/payloadAuditContext.ts'
export interface PayloadAdminAuditOptions {
  /** Include successful collection and global reads. @default true */
  includeReads?: boolean
  /**
   * Return false to skip a request. By default, every HTTP mutation is audited;
   * local API calls from jobs, seeders, and hooks are not.
   */
  shouldAudit?: (req: PayloadRequest) => boolean
}

/**
 * Audit successful Payload CMS and API mutations.
 *
 * Covers create, update, and delete operations on every collection, global
 * updates, and successful collection-auth logins/logouts. Events are emitted
 * through Evlog's audit helper, so an `auditDrain` receives them automatically.
 */
export function payloadAdminAudit(options: PayloadAdminAuditOptions = {}): Plugin {
  const shouldAudit = options.shouldAudit ?? isHttpRequest
  const includeReads = options.includeReads ?? true

  return (config) => ({
    ...config,
    collections: config.collections?.map((collection) => ({
      ...collection,
      hooks: {
        ...collection.hooks,
        beforeOperation: [
          ({
            req,
          }) => {
            bindPayloadAuditActor(req)
          },
          ...(collection.hooks?.beforeOperation ?? []),
        ],
        afterChange: [
          ...(collection.hooks?.afterChange ?? []),
          ({
            doc,
            operation,
            req,
          }) => {
            if (shouldAudit(req)) {
              emitAudit({
                action: `payload.collection.${collection.slug}.${operation}`,
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
                  bindPayloadAuditActor(req, user)
                  emitAudit({
                    action: `payload.collection.${collection.slug}.login`,
                    target: {
                      id: String(user.id),
                      type: collection.slug,
                    },
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
                    target: {
                      id: String(req.user?.id),
                      type: collection.slug,
                    },
                  })
                }
              },
            ]
          : collection.hooks?.afterLogout,
        afterRead: includeReads
          ? [
              ...(collection.hooks?.afterRead ?? []),
              ({
                doc, req,
              }) => {
                if (shouldAudit(req)) {
                  emitAudit({
                    action: `payload.collection.${collection.slug}.read`,
                    target: {
                      id: String(doc.id),
                      type: collection.slug,
                    },
                  })
                }

                return doc
              },
            ]
          : collection.hooks?.afterRead,
      },
    })),
    globals: config.globals?.map((global) => ({
      ...global,
      hooks: {
        ...global.hooks,
        beforeOperation: [
          ({
            req,
          }) => {
            bindPayloadAuditActor(req)
          },
          ...(global.hooks?.beforeOperation ?? []),
        ],
        afterChange: [
          ...(global.hooks?.afterChange ?? []),
          ({
            doc, req,
          }) => {
            if (shouldAudit(req)) {
              emitAudit({
                action: `payload.global.${global.slug}.update`,
                target: {
                  id: global.slug,
                  type: 'global',
                },
              })
            }

            return doc
          },
        ],
        afterRead: includeReads
          ? [
              ...(global.hooks?.afterRead ?? []),
              ({
                doc, req,
              }) => {
                if (shouldAudit(req)) {
                  emitAudit({
                    action: `payload.global.${global.slug}.read`,
                    target: {
                      id: global.slug,
                      type: 'global',
                    },
                  })
                }

                return doc
              },
            ]
          : global.hooks?.afterRead,
      },
    })),
  }) as Config
}

interface EmitAuditOptions {
  action: string
  target: {
    id: string
    type: string
  }
}

function emitAudit({
  action,
  target,
}: EmitAuditOptions): void {
  const log = createApplicationLogger()

  log.audit({
    action,
    target,
  })
  log.emit()
}

function isHttpRequest(req: PayloadRequest): boolean {
  return req.payloadAPI !== 'local'
}
