import { defineStore } from 'pinia'
import {
  markRaw,
  ref,
} from 'vue'

import type { Action } from '#types/action.type.ts'

export const useActionRegistryStore = defineStore('actionRegistry', () => {
  /**
   * Actions registered at module load time (static, never change).
   * These are always included in the candidate list.
   */
  const registeredActions = ref<Action[]>([])

  /**
   * Runtime-registered actions keyed by a numeric id.
   * Registered via useRegisterAction / useRegisterActionOnHover.
   */
  const temporaryActions = ref<Map<number, Action>>(new Map<number, Action>())

  let _nextId = 1

  function allActions(): Action[] {
    return [
      ...registeredActions.value,
      ...temporaryActions.value.values().map((entry) => entry),
    ]
  }

  function registerActions(...actions: Action[]): void {
    registeredActions.value.push(...actions)
  }

  function registerTemporaryAction(action: Action): number {
    const id = _nextId++

    temporaryActions.value.set(id, markRaw(action))

    return id
  }

  function unregisterAction(id: number): void {
    temporaryActions.value.delete(id)
  }

  return {
    allActions,
    registerActions,
    registerTemporaryAction,
    unregisterAction,
  }
})
