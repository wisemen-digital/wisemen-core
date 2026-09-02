export type GraphNodeType = 'doc' | 'global'

export interface GraphNode {
  id: string
  collection?: string
  key?: string
  label: string
  slug?: string
  type: GraphNodeType
}

export interface GraphEdge {
  from: string
  to: string
}

export interface DeferredField {
  field: string
  node: string
}

export interface SeedGraph {
  deferred: DeferredField[]
  edges: GraphEdge[]
  nodes: GraphNode[]
  order: string[]
}

export type RequiredLookup = (collection: string, field: string) => boolean
