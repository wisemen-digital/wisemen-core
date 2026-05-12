import type { ComputedRef } from 'vue'

import { useActiveModels } from '#composables/activeModels.composable.ts'
import type { ActionModel } from '#types/actionModel.type.ts'

export function useViewModels(
  models: ComputedRef<ActionModel[]>,
) {
  useActiveModels(models, 'view')
}
