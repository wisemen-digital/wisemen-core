import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  useRoute,
  useRouter,
} from 'vue-router'

import { useIsSelectorVisible } from '#composables/isSelectorVisible.composable.ts'
import type { RegisteredActionContext } from '#register'
import type { Action } from '#types/action.type.ts'
import type { TableSelectionState } from '#types/tableSelection.type.ts'

interface ActionContextOptions {
  keyboardEvent?: KeyboardEvent
  menuType?: 'commandMenu' | 'contextualMenu'
  metadata?: RegisteredActionContext['metadata']
  models?: RegisteredActionContext['models']
  searchInput?: string
  subActionsMeta?: Record<string, number | null>
}

async function executeAction(
  action: Action,
  ctx: RegisteredActionContext,
  options?: { onComplete?: () => void },
): Promise<void> {
  if (action.execute === undefined) {
    return
  }

  await action.execute(ctx)

  options?.onComplete?.()
}

function dedupeModels(models: RegisteredActionContext['models']): RegisteredActionContext['models'] {
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
  const focusedModels = ref<RegisteredActionContext['models']>([])
  const viewModels = ref<RegisteredActionContext['models']>([])
  const selectedModels = ref<RegisteredActionContext['models']>([])
  const tableSelection = ref<TableSelectionState | null>(null)
  const metadata = ref<RegisteredActionContext['metadata']>({} as RegisteredActionContext['metadata'])
  const router = useRouter()
  const route = useRoute<any>()
  const isAnyDialogOpen = useIsSelectorVisible('[data-dialog]:not([data-command-menu])')

  function registerMetadata(meta: RegisteredActionContext['metadata']): void {
    metadata.value = {
      ...metadata.value,
      ...meta,
    }
  }

  function unregisterMetadata(key: string): void {
    const copy = {
      ...metadata.value,
    } as Record<string, unknown>

    delete copy[key]
    metadata.value = copy as RegisteredActionContext['metadata']
  }

  function setFocusedModels(models: RegisteredActionContext['models']): void {
    focusedModels.value = models
  }

  function setViewModels(models: RegisteredActionContext['models']): void {
    viewModels.value = models
  }

  function setSelectedModels(models: RegisteredActionContext['models']): void {
    selectedModels.value = models
  }

  function setTableSelection(selection: TableSelectionState | null): void {
    tableSelection.value = selection
  }

  function clearTableSelection(): void {
    tableSelection.value = {
      items: [],
      type: 'include',
    }
  }

  function actionContext(options: ActionContextOptions): RegisteredActionContext {
    const allModels = dedupeModels([
      ...(options.models ?? []),
      ...selectedModels.value,
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
      hasTargetedModelsOfType: (type: any) => allModels.some((m) => (m as any).modelName === type),
      isRouteActive: (routeName: any, exact: any): boolean => {
        if (exact === undefined || exact === false) {
          return route.matched.some((route: any) => route.name === routeName)
        }

        return route.name === routeName
      },
      allModels,
      clearTableSelection,
      focusedModels: focusedModels.value,
      keyboardEvent: options.keyboardEvent,
      menuType: options.menuType,
      metadata: mergedMetadata as RegisteredActionContext['metadata'],
      models: options.models ?? [],
      router,
      searchInput: options.searchInput ?? '',
      selectedModels: selectedModels.value,
      subActionsMeta: options.subActionsMeta,
      tableSelection: tableSelection.value,
      targetedModelOfType: (type: any) => allModels.find((m) => (m as any).modelName === type) ?? null,
      targetedModelOfTypeOrThrow: (type: any): any => {
        const model = allModels.find((m) => (m as any).modelName === type) ?? null

        if (model === null) {
          throw new Error(`Model of type: ${type} not found`)
        }

        return model
      },
      targetedModelsOfType: (type: any) => allModels.filter((m) => (m as any).modelName === type),
    } as RegisteredActionContext
  }

  return {
    actionContext,
    clearTableSelection,
    executeAction,
    focusedModels,
    metadata,
    registerMetadata,
    selectedModels,
    setFocusedModels,
    setSelectedModels,
    setTableSelection,
    setViewModels,
    tableSelection,
    unregisterMetadata,
    viewModels,
  }
})
