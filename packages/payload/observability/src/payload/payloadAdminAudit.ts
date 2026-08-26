import { audit } from 'evlog'
import type {
  Config,
  PayloadRequest,
  Plugin,
} from 'payload'

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
        afterRead: includeReads
          ? [
              ...(collection.hooks?.afterRead ?? []),
              ({
                doc, req,
              }) => {
                if (shouldAudit(req)) {
                  emitAudit({
                    action: `payload.collection.${collection.slug}.read`,
                    req,
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
        afterChange: [
          ...(global.hooks?.afterChange ?? []),
          ({
            doc, req,
          }) => {
            if (shouldAudit(req)) {
              emitAudit({
                action: `payload.global.${global.slug}.update`,
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
        afterRead: includeReads
          ? [
              ...(global.hooks?.afterRead ?? []),
              ({
                doc, req,
              }) => {
                if (shouldAudit(req)) {
                  emitAudit({
                    action: `payload.global.${global.slug}.read`,
                    req,
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
  req: PayloadRequest
  target: {
    id: string
    type: string
  }
  user?: PayloadRequest['user']
}

function emitAudit({
  action,
  req,
  target,
  user = req.user,
}: EmitAuditOptions): void {
  audit({
    action,
    actor: user == null
      ? {
          id: 'anonymous',
          displayName: 'Anonymous request',
          type: 'api',
        }
      : {
          id: String(user.id),
          type: 'user',
        },
    target,
  })
}

function isHttpRequest(req: PayloadRequest): boolean {
  return req.payloadAPI !== 'local'
}
