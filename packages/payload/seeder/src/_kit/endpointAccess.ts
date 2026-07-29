// GENERATED — DO NOT EDIT. Source: tools/plugin-kit/src/endpointAccess.ts
// Vendored by `pnpm kit:sync`; `pnpm kit:check` fails if this drifts from the source.
import type { PayloadRequest } from 'payload'

/**
 * A gate on one of a plugin's HTTP endpoints. Where Payload's collection `Access` is
 * `({ req }) => …`, an endpoint gate takes the request directly and answers "may this request run
 * this endpoint?". A consumer sets one per endpoint through the plugin's `options.access.<role>`.
 *
 * The abstraction stretches on purpose (Chad's call, 2026-07-18): even a machine endpoint whose
 * real check is a shared secret or a webhook signature is expressed as an `EndpointAccess`, so
 * "how do I gate this?" has exactly one answer across every plugin — `options.access`. Such an
 * endpoint's *default* gate simply ignores `req.user` and inspects headers instead.
 */
export type EndpointAccess = (req: PayloadRequest) => boolean | Promise<boolean>

/** The uniform default gate: any logged-in Payload user, on any collection. */
export const authedRequest: EndpointAccess = (req) => Boolean(req.user)

/** Public — the gate for an endpoint that must answer anonymous traffic (e.g. image serving). */
export const publicRequest: EndpointAccess = () => true

/**
 * Run the consumer's gate if they set one, else the endpoint's own default. Keeps every endpoint's
 * check one line: `if (!(await isAllowed(access.role, req, fallback))) return denied`. An explicit
 * `false` from the consumer's gate is honoured (only an unset gate falls through to `fallback`).
 */
export async function isAllowed(
  gate: EndpointAccess | undefined,
  req: PayloadRequest,
  fallback: EndpointAccess = authedRequest,
): Promise<boolean> {
  return (await gate?.(req)) ?? fallback(req)
}
