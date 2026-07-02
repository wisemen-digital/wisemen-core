<script setup lang="ts">
import type {
  Action,
  ActionContext,
} from '@wisemen/vue-core-actions'
import {
  GroupPriority,
  resolveActionName,
  useActionManagerStore,
  useTemporaryActions,
  useViewModels,
} from '@wisemen/vue-core-actions'
import { Primitive } from 'reka-ui'
import type { Component } from 'vue'
import {
  computed,
  ref,
} from 'vue'

import type { RegisteredActionContext } from '@/register'

const props = withDefaults(defineProps<{
  isCurrentContextOnly: boolean
  action: Action
  models?: RegisteredActionContext['models']
  /**
   * @deprecated Use `isCurrentContextOnly` instead.
   */
  currentContextOnly?: boolean
}>(), {
  currentContextOnly: undefined,
})

const manager = useActionManagerStore()

const isCurrentContextOnly = props.isCurrentContextOnly || props.currentContextOnly === true

if (!isCurrentContextOnly) {
  useTemporaryActions(props.action, (props.action.group?.priority as GroupPriority) ?? GroupPriority.VIEW)
  useViewModels(computed(() => props.models ?? []))
}

const isExecuting = ref<boolean>(false)

const context = computed<ActionContext>(() => {
  return manager.actionContext({
    models: props.models,
  })
})

async function onClick(): Promise<void> {
  if (props.action.isApplicable !== undefined
    && !props.action.isApplicable(context.value)
  ) {
    return
  }

  isExecuting.value = true

  try {
    await manager.executeAction(props.action, context.value)
  }
  finally {
    isExecuting.value = false
  }
}

const label = computed<string>(() => resolveActionName(props.action, context.value))

const icon = computed<Component | null>(
  () => props.action.icon?.(context.value) ?? null,
)

const canExecute = computed<boolean>(() => {
  if (props.action.isApplicable === undefined) {
    return true
  }

  return props.action.isApplicable(context.value)
})
</script>

<template>
  <Primitive
    :as-child="true"
    @click="onClick"
  >
    <slot
      :label="label"
      :icon="icon"
      :is-executing="isExecuting"
      :can-execute="canExecute"
      :keyboard-shortcut="props.action.keyboardShortcut ?? null"
    />
  </Primitive>
</template>
