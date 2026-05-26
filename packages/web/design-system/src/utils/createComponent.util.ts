import { h } from 'vue'

type IgnoredProps
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

type GetComponentProps<TComponent extends abstract new (...args: any) => any>
  = Omit<InstanceType<TComponent>['$props'], IgnoredProps>

// Workaround to avoid TypeScript hitting its type-checking limits with Vue's `h` function.
// It also cleans up the prop types by removing Vue internal props.
export function createComponent<TComponent extends abstract new (...args: any)
=> any>(component: TComponent, props: GetComponentProps<TComponent>): any {
  return h(component as any, props) as any
}
