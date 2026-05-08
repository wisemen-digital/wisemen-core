import type {
  Component,
  DefineComponent,
} from 'vue'
import { shallowRef } from 'vue'

import type { Action } from '#types/action.type.ts'
import type { ActionContext } from '#types/actionContext.type'
import type { ActionModel } from '#types/actionModel.type.ts'
import type { KeyboardShortcut } from '#types/keyboardShortcut.type.ts'

export const isAuthenticated = shallowRef<boolean>(false)

/**
 * Type for a generically-typed ActionDropdownMenu component.
 * Import ActionDropdownMenu from @wisemen/vue-core-design-system and cast with this type.
 */
export type TypedActionDropdownMenu<TActionContext, TActionModel extends ActionModel> = DefineComponent<{
  isOpen?: boolean
  actions?: Action<TActionContext>[]
  metadata?: Record<string, unknown>
  models?: TActionModel[]
  parentAction?: Action<TActionContext>
}>

/**
 * Type for a generically-typed ActionTrigger component.
 * Import ActionTrigger from @wisemen/vue-core-design-system and cast with this type.
 */
export type TypedActionTrigger<TActionContext, TActionModel extends ActionModel> = new () => {
  $props: {
    action: Action<TActionContext>
    models?: TActionModel[]
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

function setIsAuthenticated(value: boolean): void {
  isAuthenticated.value = value
}

export function _createUntypedAction<TAction extends Action<ActionContext>>(action: TAction): TAction {
  return action
}

// eslint-disable-next-line eslint-plugin-wisemen/explicit-function-return-type-with-regex
export function createActions<
  TActionContext,
  // TActionModel extends ActionModel,
>() {
  function createAction(action: Action<TActionContext>): Action<TActionContext> {
    return action
  }

  return {
    createAction,
    setIsAuthenticated,
  }
}
