<script setup lang="ts">
import type {
  Action,
  ActionModel,
} from '@wisemen/vue-core-actions'
import {
  GroupPriority,
  resolveApplicable,
  useActionManagerStore,
  useTemporaryActions,
} from '@wisemen/vue-core-actions'
import { computed } from 'vue'

import ActionDropdownMenuContent from '@/ui/action-dropdown-menu/ActionDropdownMenuContent.vue'
import { UIDropdownMenu } from '@/ui/dropdown-menu/index'

const props = defineProps<{
  actions?: Action[]
  currentContextOnly: boolean
  metadata?: Record<string, unknown>
  models?: ActionModel[]
  parentAction?: Action
}>()

const isOpen = defineModel<boolean>('isOpen', {
  default: false,
  required: false,
})

if (!props.currentContextOnly) {
  useTemporaryActions(props.actions ?? [], GroupPriority.VIEW)
  useTemporaryActions(props.parentAction ?? [], GroupPriority.VIEW)
}

const manager = useActionManagerStore()

const hasApplicableActions = computed<boolean>(() => {
  if (props.parentAction !== undefined) {
    return true
  }

  const ctx = manager.actionContext({
    menuType: 'contextualMenu',
    metadata: props.metadata,
    models: props.models ?? [],
  })

  return (props.actions ?? []).some((action) => resolveApplicable(action, ctx))
})
</script>

<template>
  <UIDropdownMenu
    v-if="hasApplicableActions"
    v-model:is-open="isOpen"
  >
    <template #trigger>
      <slot />
    </template>

    <template #content>
      <ActionDropdownMenuContent
        :metadata="props.metadata"
        :actions="props.actions ?? []"
        :parent-action="props.parentAction"
        :models="props.models ?? []"
      />
    </template>
  </UIDropdownMenu>
</template>
