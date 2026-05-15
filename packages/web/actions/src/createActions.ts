import type {
  Component,
  DefineComponent,
} from 'vue'
import { shallowRef } from 'vue'

import type { Action } from '#types/action.type.ts'
import type { ActionContext } from '#types/actionContext.type'
import type { KeyboardShortcut } from '#types/keyboardShortcut.type.ts'

export const isAuthenticated = shallowRef<boolean>(false)

type TypedActionDropdownMenu<TActionContext extends ActionContext> = DefineComponent<{
  isOpen?: boolean
  actions?: Action<TActionContext>[]
  currentContextOnly: boolean
  metadata?: TActionContext['metadata']
  models?: TActionContext['models']
  parentAction?: Action<TActionContext>
}>

type TypedActionTrigger<TActionContext extends ActionContext> = new () => {
  $props: {
    action: Action<TActionContext>
    currentContextOnly: boolean
    metadata?: TActionContext['metadata']
    models?: TActionContext['models']
  }
  $slots: {
    default: (props: {
      isExecuting: boolean
      canExecute: boolean
      icon: Component | null
      keyboardShortcut: KeyboardShortcut | null
      label: string
    }) => any
  }
}

type TypedActionFocus<TActionContext extends ActionContext> = new () => {
  $props: {
    actions: Action<TActionContext>[]
    metadata?: TActionContext['metadata']
    models?: TActionContext['models']
  }
}

function setIsAuthenticated(value: boolean): void {
  isAuthenticated.value = value
}

export function _createUntypedAction<TAction extends Action<ActionContext>>(action: TAction): TAction {
  return action
}

export function typedActionDropdownMenu<TActionContext>(
  component: Component,
): TypedActionDropdownMenu<TActionContext extends ActionContext<any, any, any> ? TActionContext : never> {
  return component as any
}

export function typedActionTrigger<TActionContext>(
  component: Component,
): TypedActionTrigger<TActionContext extends ActionContext<any, any, any> ? TActionContext : never> {
  return component as any
}

export function typedActionFocus<TActionContext>(
  component: Component,
): TypedActionFocus<TActionContext extends ActionContext<any, any, any> ? TActionContext : never> {
  return component as any
}

// eslint-disable-next-line eslint-plugin-wisemen/explicit-function-return-type-with-regex
export function createActions<TActionContext>() {
  function createAction(action: Action<TActionContext>): Action<TActionContext> {
    return action
  }

  return {
    createAction,
    setIsAuthenticated,
  }
}
