import type {
  Component,
  Ref,
  ShallowRef,
} from 'vue'
import {
  computed,
  ref,
} from 'vue'

import type { Action } from '#types/action.type.ts'
import type { ActionContext } from '#types/actionContext.type.ts'
import { resolveActionPreview } from '#utils/resolveActions.util.ts'

interface UseActionPreviewOptions {
  highlightedActionId: Ref<string | null>
  getContext: () => ActionContext
  resolvedActions: Ref<Action[]> | ShallowRef<Action[]>
}

export function useActionPreview({
  highlightedActionId,
  getContext,
  resolvedActions,
}: UseActionPreviewOptions) {
  const isPreviewVisible = ref<boolean>(false)

  const preview = computed<Component | null>(() => {
    if (highlightedActionId.value === null || !isPreviewVisible.value) {
      return null
    }

    const action = resolvedActions.value.find((a) => a.id === highlightedActionId.value) ?? null

    if (action === null) {
      return null
    }

    return resolveActionPreview(action, getContext())
  })

  function onShowPreview(): void {
    isPreviewVisible.value = true
  }

  function onHidePreview(): void {
    isPreviewVisible.value = false
  }

  function onKeyDown(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement
    const isAtEnd = input.selectionStart === input.value.length

    if (isAtEnd && event.key === 'ArrowRight') {
      isPreviewVisible.value = true
      event.preventDefault()
    }

    if (event.key === 'ArrowLeft' && isPreviewVisible.value) {
      isPreviewVisible.value = false
      event.preventDefault()
    }

    if (
      event.key !== 'ArrowLeft'
      && event.key !== 'ArrowRight'
      && event.key !== 'ArrowUp'
      && event.key !== 'ArrowDown'
    ) {
      isPreviewVisible.value = false
    }
  }

  return {
    preview,
    onHidePreview,
    onKeyDown,
    onShowPreview,
  }
}
