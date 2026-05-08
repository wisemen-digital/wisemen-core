import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  useRoute,
  useRouter,
} from 'vue-router'

import { useIsSelectorVisible } from '#composables/isSelectorVisible.composable.ts'
import type { Action } from '#types/action.type.ts'
import type { ActionContext } from '#types/actionContext.type.ts'
import type { ActionModel } from '#types/actionModel.type.ts'

interface ActionContextOptions {
  keyboardEvent?: KeyboardEvent
  menuType?: 'commandMenu' | 'contextualMenu'
  metadata?: Record<string, unknown>
  models?: ActionModel[]
  searchInput?: string
  subActionsMeta?: Record<string, number | null>
}

async function executeAction(
  action: Action,
  ctx: ActionContext,
  options?: { onComplete?: () => void },
): Promise<void> {
  if (action.execute === undefined) {
    return
  }

  await action.execute(ctx)

  options?.onComplete?.()
}

function dedupeModels(models: ActionModel[]): ActionModel[] {
  const seen = new Set<unknown>()

  return models.filter((model) => {
    if (seen.has(model)) {
      return false
    }

    seen.add(model)

    return true
  })
}

export const useActionManagerStore = defineStore('actionManager', () => {
  const focusedModels = ref<ActionModel[]>([])
  const viewModels = ref<ActionModel[]>([])
  const metadata = ref<Record<string, unknown>>({})
  const router = useRouter()
  const route = useRoute<any>()
  const isAnyDialogOpen = useIsSelectorVisible('[data-dialog]:not([data-command-menu])')

  function registerMetadata(meta: Record<string, unknown>): void {
    metadata.value = {
      ...metadata.value,
      ...meta,
    }
  }

  function unregisterMetadata(key: string): void {
    const copy = {
      ...metadata.value,
    }

    delete copy[key]
    metadata.value = copy
  }

  function setFocusedModels(models: ActionModel[]): void {
    focusedModels.value = models
  }

  function setViewModels(models: ActionModel[]): void {
    viewModels.value = models
  }

  function actionContext(options: ActionContextOptions): ActionContext {
    const allModels = dedupeModels([
      ...(options.models ?? []),
      ...viewModels.value,
      ...focusedModels.value,
    ])

    const mergedMetadata = {
      ...metadata.value,
      ...options.metadata,
    }

    return {
      getPaginationOffsetForSubActionId: (id: string) => options.subActionsMeta?.[id] ?? null,
      hasActiveDialogs: () => isAnyDialogOpen.value,
      hasTargetedModelsOfType: (type) => allModels.some((m) => (m as any).modelName === type),
      isRouteActive: (routeName, exact): boolean => {
        if (exact === undefined || exact === false) {
          return route.matched.some((route: any) => route.name === routeName)
        }

        return route.name === routeName
      },
      allModels,
      focusedModels: focusedModels.value,
      keyboardEvent: options.keyboardEvent,
      menuType: options.menuType,
      metadata: mergedMetadata,
      models: options.models ?? [],
      router,
      searchInput: options.searchInput ?? '',
      subActionsMeta: options.subActionsMeta,
      targetedModelOfType: (type) => allModels.find((m) => (m as any).modelName === type) ?? null,
      targetedModelOfTypeOrThrow: (type): any => {
        const model = allModels.find((m) => (m as any).modelName === type) ?? null

        if (model === null) {
          throw new Error(`Model of type: ${type} not found`)
        }

        return model
      },
      targetedModelsOfType: (type) => allModels.filter((m) => (m as any).modelName === type),
    }
  }

  return {
    actionContext,
    executeAction,
    focusedModels,
    metadata,
    registerMetadata,
    setFocusedModels,
    setViewModels,
    unregisterMetadata,
    viewModels,
  }
})
