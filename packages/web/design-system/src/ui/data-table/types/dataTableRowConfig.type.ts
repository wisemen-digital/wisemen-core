import type { Action } from '@wisemen/vue-core-actions'

import type {
  RegisteredActionContext,
  RegisteredRouteLocationRaw,
} from '@/register'

/**
 * A row's click target: either a real navigation (rendered as an actual link, so cmd/middle
 * click and right-click-copy-link work natively) or an `Action` (resolved through the same
 * registry — applicability, disabled reason, execution state — as `actions.inline`/`.more`).
 * Build these via `createDataTableRowLinkClick`/`createDataTableRowActionClick`, not by hand.
 */
export type DataTableRowClick
  = | {
    action: Action
    type: 'action'
  }
  | {
    to: RegisteredRouteLocationRaw
    type: 'link'
  }

export function createDataTableRowLinkClick(to: RegisteredRouteLocationRaw): DataTableRowClick {
  return {
    to,
    type: 'link',
  }
}

export function createDataTableRowActionClick(action: Action): DataTableRowClick {
  return {
    action,
    type: 'action',
  }
}

export interface DataTableRowConfig {
  actions?: {
    inline: Action[]
    more: Action[]
  } | null
  model: RegisteredActionContext['models'][number]
  onClick?: DataTableRowClick | null
}
