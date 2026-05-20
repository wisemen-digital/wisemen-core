<script setup lang="ts">
import type { Action } from '@wisemen/vue-core-actions'
import {
  GroupPriority,
  resolveApplicable,
  useActionManagerStore,
  useTemporaryActions,
} from '@wisemen/vue-core-actions'
import { computed } from 'vue'

import type { RegisteredActionContext } from '@/register'
import ActionDropdownMenuContent from '@/ui/action-dropdown-menu/ActionDropdownMenuContent.vue'
import type { DropdownMenuProps } from '@/ui/dropdown-menu/dropdownMenu.props'
import { UIDropdownMenu } from '@/ui/dropdown-menu/index'

const props = defineProps<DropdownMenuProps & {
  actions?: Action[]
  currentContextOnly: boolean
  metadata?: RegisteredActionContext['metadata']
  models?: RegisteredActionContext['models']
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
  const ctx = manager.actionContext({
    menuType: 'contextualMenu',
    metadata: props.metadata,
    models: props.models ?? [],
  })

  if (props.parentAction !== undefined) {
    return resolveApplicable(props.parentAction, ctx)
  }

  return (props.actions ?? []).some((action) => resolveApplicable(action, ctx))
})
</script>

<template>
  <UIDropdownMenu
    v-if="hasApplicableActions"
    v-bind="props"
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

  <slot
    v-else
    name="fallback"
  />
</template>
