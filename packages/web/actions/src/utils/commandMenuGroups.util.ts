import type { Component } from 'vue'

import type { Action } from '#types/action.type.ts'
import type { ActionContext } from '#types/actionContext.type.ts'
import type { ActionGroup } from '#types/actionGroup.type.ts'
import { resolveActionValue } from '#utils/resolveActions.util.ts'

export interface CommandMenuGroup {
  icon: Component | null
  items: Action[]
  key: string
  label: string | null
  showIfOnlyGroup: boolean
}

let _unnamedGroupCounter = 0
const _unnamedGroupKeys = new WeakMap<object, string>()

// Two groups sharing the same resolved name are considered the same section.
// Unnamed groups each get a stable per-object key via a module-level WeakMap so
// keys survive component remounts as long as the group object reference is stable.
function resolveStableGroupKey(group: ActionGroup | undefined, ctx: ActionContext): string {
  if (group === undefined) {
    return 'no-group'
  }

  if (group.name) {
    return resolveActionValue(group.name, ctx)
  }

  if (!_unnamedGroupKeys.has(group)) {
    _unnamedGroupKeys.set(group, `unnamed-${_unnamedGroupCounter++}`)
  }

  return _unnamedGroupKeys.get(group)!
}

export function buildCommandMenuGroups(actions: Action[], ctx: ActionContext): CommandMenuGroup[] {
  const groupMap = new Map<string, CommandMenuGroup>()

  for (const action of actions) {
    const group = action.group
    const key = resolveStableGroupKey(group, ctx)

    let commandGroup = groupMap.get(key)

    if (commandGroup === undefined) {
      const rawName = group?.name ? resolveActionValue(group.name, ctx) : null

      commandGroup = {
        icon: group?.icon?.(ctx) ?? null,
        items: [],
        key,
        label: rawName,
        showIfOnlyGroup: group?.showIfOnlyGroup ?? false,
      }
      groupMap.set(key, commandGroup)
    }

    commandGroup.items.push(action)
  }

  return [
    ...groupMap.values(),
  ]
}
