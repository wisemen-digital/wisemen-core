import type { Component } from 'vue'

export interface DialogTriggerProps {
  'id': string
  'aria-controls'?: string
  'aria-expanded': boolean
  'aria-haspopup': 'dialog'
  'data-state': boolean
}

export type IgnoredProps
  = | '__v_isVNode'
    | 'class'
    | 'key'
    | 'onVnodeBeforeMount'
    | 'onVnodeBeforeUnmount'
    | 'onVnodeBeforeUpdate'
    | 'onVnodeMounted'
    | 'onVnodeUnmounted'
    | 'onVnodeUpdated'
    | 'ref'
    | 'ref_for'
    | 'ref_key'
    | 'style'

type PickKeys<T extends object, TValue extends null | undefined> = NonNullable<
  { [K in keyof T]: TValue extends T[K] ? K : never }[keyof T]
>

type OptionalKeys<T extends object> = PickKeys<T, undefined>
type RequiredKeys<T extends object> = Exclude<keyof T, OptionalKeys<T>>

export type GetComponentProps<TComponent extends abstract new (...args: any) => any>
  = Omit<InstanceType<TComponent>['$props'], IgnoredProps>

export type OpenDialog<TProps extends Record<string, any>> = TProps extends Record<string, never>
  ? () => Promise<void>
  : RequiredKeys<Omit<TProps, IgnoredProps>> extends Record<string, never>
    ? (attrs?: Omit<TProps, IgnoredProps>) => Promise<void>
    : (attrs: Omit<TProps, IgnoredProps>) => Promise<void>

export interface Dialog {
  id: string
  isOpen: boolean
  component: Component
}
