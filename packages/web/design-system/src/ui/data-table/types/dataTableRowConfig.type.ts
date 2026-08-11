import type { Action } from '@wisemen/vue-core-actions'

import type { RegisteredActionContext } from '@/register'

export interface DataTableRowConfig {
  onClick?: (() => void) | null
  model: RegisteredActionContext['models'][number]
  actions: {
    inline: Action[]
    more: Action[]
  }
}
