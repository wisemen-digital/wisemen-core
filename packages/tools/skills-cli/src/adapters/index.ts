import type {
  Adapter,
  TargetName,
} from '../types.js'
import { agentsMdAdapter } from './agents-md.js'
import { claudeAdapter } from './claude.js'
import { llmsTxtAdapter } from './llms-txt.js'

const REGISTRY: Record<TargetName, Adapter> = {
  'agents-md': agentsMdAdapter,
  'claude': claudeAdapter,
  'llms-txt': llmsTxtAdapter,
}

export function resolveAdapters(targets: TargetName[]): Adapter[] {
  const seen = new Set<TargetName>()
  const out: Adapter[] = []

  for (const name of targets) {
    if (seen.has(name)) { continue }
    const adapter = REGISTRY[name]

    if (adapter === undefined) {
      throw new Error(`Unknown adapter target: "${String(name)}". Valid targets: ${Object.keys(REGISTRY).join(', ')}`)
    }

    seen.add(name)
    out.push(adapter)
  }

  return out
}

export function allTargets(): TargetName[] {
  return Object.keys(REGISTRY) as TargetName[]
}

export { agentsMdMergeHelpers } from './agents-md.js'
