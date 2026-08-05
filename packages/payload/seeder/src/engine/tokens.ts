import type {
  AnyRef,
  Ref,
} from '#refs'
import {
  isAnyToken,
  isRef,
} from '#refs'
import type { ResolveContext } from '#types'

export const docNodeId = (collection: string, key: string): string => `${collection}:${key}`

export function collectTokens(value: unknown, out: AnyRef[] = []): AnyRef[] {
  if (isRef(value)) {
    out.push(value)

    return out
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      collectTokens(item, out)
    }
  }
  else if (value && typeof value === 'object') {
    for (const v of Object.values(value)) {
      collectTokens(v, out)
    }
  }

  return out
}

export function resolveTokens(value: unknown, ctx: ResolveContext): unknown {
  if (isRef(value)) {
    return resolveRef(value, ctx)
  }
  if (isAnyToken(value)) {
    return value
  }
  if (Array.isArray(value)) {
    return value.map((item) => resolveTokens(item, ctx))
  }
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {}

    for (const [
      k,
      v,
    ] of Object.entries(value)) {
      out[k] = resolveTokens(v, ctx)
    }

    return out
  }

  return value
}

function resolveRef(token: Ref, ctx: ResolveContext): number | string {
  const id = ctx.docs.get(docNodeId(token.collection, token.key))

  if (id === undefined) {
    throw new Error(`[payload-seed] ${ctx.where}: unresolved ref('${token.collection}', '${token.key}') - no seeded doc with that _key.`)
  }

  return id
}
