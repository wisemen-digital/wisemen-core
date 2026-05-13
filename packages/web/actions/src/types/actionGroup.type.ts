import type { Component } from 'vue'

import type {
  ActionContext,
  Resolvable,
} from '#types/actionContext.type.ts'

export interface ActionGroup<TActionContext = any> {
  name?: Resolvable<string, TActionContext>
  /**
   * When a child action is "lifted" into a top-level search result, its group is
   * replaced with this one rather than the original group.
   * Used to keep lifted children in a logical section (e.g. the parent's group).
   */
  groupWhenLifted?: ActionGroup<TActionContext>
  icon?: (ctx: ActionContext) => Component
  priority?: Resolvable<number, TActionContext>
  /**
   * When there's only 1 group in the command menu results, the group label is hidden by default.
   * When set to true, the label of this group will always be visible, even if there's only 1 group
   */
  showIfOnlyGroup?: boolean
}
