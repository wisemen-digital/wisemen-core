// GENERATED — DO NOT EDIT. Source: tools/plugin-kit/src/authd.ts
// Vendored by `pnpm kit:sync`; `pnpm kit:check` fails if this drifts from the source.
import type { Access } from 'payload'

/**
 * Logged in, on any collection. The baseline gate for a plugin's own collections — a consumer
 * replaces it through `collections.<name>.access`, which shallow-merges over this.
 */
export const authd: Access = ({
  req,
}) => Boolean(req.user)

/**
 * Public read. Paired with `authd` on write, this is the shape of a collection whose content is
 * meant to be served to anonymous traffic.
 */
export const anyone: Access = () => true
