import type { Action } from '@wisemen/vue-core-actions'

import type { RegisteredActionContext } from '@/register'

export interface DataTableRowConfig {
  actions: {
    inline: Action[]
    more: Action[]
  }
  model: RegisteredActionContext['models'][number]
  onClick?: (() => void) | null
}
