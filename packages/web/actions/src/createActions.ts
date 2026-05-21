import { shallowRef } from 'vue'

import type { Action } from '#types/action.type.ts'

import type { RegisteredActionContext } from './register'

export const isAuthenticated = shallowRef<boolean>(false)

export function setIsAuthenticated(value: boolean): void {
  isAuthenticated.value = value
}

export function createAction(action: Action<RegisteredActionContext>): Action<RegisteredActionContext> {
  return action
}
