import type {
  BuiltModel,
  DeferredField,
  GraphEdge,
  GraphNode,
  RequiredLookup,
  SeedGraph,
} from '#types'

import {
  collectTokens,
  docNodeId,
} from './tokens'

const collectionOf = (nodeId: string): string => nodeId.slice(0, nodeId.indexOf(':'))

export function buildGraph(model: BuiltModel, opts: { isRequired?: RequiredLookup } = {}): SeedGraph {
  const nodes: GraphNode[] = []
  const edges: GraphEdge[] = []
  const docIds = new Set<string>()
  const isRequired = opts.isRequired ?? (() => true)
  const fieldTargets = new Map<string, Map<string, Set<string>>>()

  for (const coll of model.collections) {
    for (const rec of coll.records) {
      const id = docNodeId(coll.slug, rec.key)

      docIds.add(id)
      fieldTargets.set(id, new Map())
      nodes.push({
        id,
        collection: coll.slug,
        key: rec.key,
        label: `${coll.slug}:${rec.key}`,
        type: 'doc',
      })
    }
  }

  const recordRefs = (fromId: string, data: Record<string, unknown>, track: boolean) => {
    for (const [
      field,
      value,
    ] of Object.entries(data)) {
      for (const token of collectTokens(value)) {
        const to = docNodeId(token.collection, token.key)

        edges.push({
          from: fromId,
          to,
        })

        if (!track || !docIds.has(to)) {
          continue
        }
        const byField = fieldTargets.get(fromId)

        if (!byField) {
          continue
        }
        let targets = byField.get(field)

        if (!targets) {
          targets = new Set()
          byField.set(field, targets)
        }

        targets.add(to)
      }
    }
  }

  for (const coll of model.collections) {
    for (const rec of coll.records) {
      recordRefs(docNodeId(coll.slug, rec.key), rec.data, true)
    }
  }
  for (const g of model.globals) {
    const id = `global:${g.slug}`

    nodes.push({
      id,
      label: g.slug,
      slug: g.slug,
      type: 'global',
    })
    recordRefs(id, g.data, false)
  }

  const {
    deferred, order,
  } = planOrder(docIds, fieldTargets, isRequired)

  return {
    deferred,
    edges,
    nodes,
    order,
  }
}

function planOrder(
  docIds: Set<string>,
  fieldTargets: Map<string, Map<string, Set<string>>>,
  isRequired: RequiredLookup,
): { deferred: DeferredField[]
  order: string[] } {
  const deps = new Map<string, Set<string>>()

  for (const id of docIds) {
    deps.set(id, new Set())
  }
  for (const [
    node,
    byField,
  ] of fieldTargets) {
    for (const targets of byField.values()) {
      for (const to of targets) {
        deps.get(node)?.add(to)
      }
    }
  }

  const seen = new Set<string>()
  const deferred: DeferredField[] = []

  for (let cycle = findCycle(docIds, deps); cycle !== null; cycle = findCycle(docIds, deps)) {
    if (!breakCycle(cycle, fieldTargets, deps, isRequired, deferred, seen)) {
      throw new Error(
        `[payload-seed] dependency cycle detected: ${cycle.join(' -> ')} - every ref in the cycle is on a required field; make one optional to break it.`,
      )
    }
  }

  return {
    deferred,
    order: topoSortDocs(docIds, deps),
  }
}

function breakCycle(
  cycle: string[],
  fieldTargets: Map<string, Map<string, Set<string>>>,
  deps: Map<string, Set<string>>,
  isRequired: RequiredLookup,
  deferred: DeferredField[],
  seen: Set<string>,
): boolean {
  for (let i = 0; i < cycle.length - 1; i++) {
    const from = cycle[i]
    const to = cycle[i + 1]

    if (from === undefined || to === undefined) {
      continue
    }
    const byField = fieldTargets.get(from)

    if (!byField) {
      continue
    }
    for (const [
      field,
      targets,
    ] of byField) {
      if (!targets.has(to) || isRequired(collectionOf(from), field)) {
        continue
      }
      for (const t of targets) {
        deps.get(from)?.delete(t)
      }
      const key = `${from} ${field}`

      if (!seen.has(key)) {
        seen.add(key)
        deferred.push({
          field,
          node: from,
        })
      }

      return true
    }
  }

  return false
}

function findCycle(docIds: Set<string>, deps: Map<string, Set<string>>): string[] | null {
  const stack: string[] = []
  let cycle: string[] | null = null
  const state = new Map<string, 'done' | 'visiting'>()

  const visit = (id: string) => {
    if (cycle) {
      return
    }
    const s = state.get(id)

    if (s === 'done') {
      return
    }
    if (s === 'visiting') {
      cycle = [
        ...stack.slice(stack.indexOf(id)),
        id,
      ]

      return
    }

    state.set(id, 'visiting')
    stack.push(id)

    for (const dep of deps.get(id) ?? []) {
      if (!docIds.has(dep)) {
        continue
      }

      visit(dep)

      if (cycle) {
        break
      }
    }

    stack.pop()
    state.set(id, 'done')
  }

  for (const id of docIds) {
    if (cycle) {
      break
    }

    visit(id)
  }

  return cycle
}

function topoSortDocs(docIds: Set<string>, deps: Map<string, Set<string>>): string[] {
  const order: string[] = []
  const stack: string[] = []
  const state = new Map<string, 'done' | 'visiting'>()

  const visit = (id: string) => {
    const s = state.get(id)

    if (s === 'done') {
      return
    }
    if (s === 'visiting') {
      const cycle = [
        ...stack.slice(stack.indexOf(id)),
        id,
      ].join(' -> ')

      throw new Error(`[payload-seed] dependency cycle detected: ${cycle}`)
    }

    state.set(id, 'visiting')
    stack.push(id)

    for (const dep of deps.get(id) ?? []) {
      if (!docIds.has(dep)) {
        continue
      }

      visit(dep)
    }

    stack.pop()
    state.set(id, 'done')
    order.push(id)
  }

  for (const id of docIds) {
    visit(id)
  }

  return order
}
