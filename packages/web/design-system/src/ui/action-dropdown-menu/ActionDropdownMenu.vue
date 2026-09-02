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

const props = withDefaults(defineProps<DropdownMenuProps & {
  isCurrentContextOnly?: boolean
  actions?: Action[]
  /**
   * @deprecated Use `isCurrentContextOnly` instead.
   */
  currentContextOnly?: boolean
  metadata?: RegisteredActionContext['metadata']
  models?: RegisteredActionContext['models']
  parentAction?: Action
}>(), {
  isCurrentContextOnly: undefined,
  currentContextOnly: undefined,
})

const isOpen = defineModel<boolean>('isOpen', {
  default: false,
  required: false,
})

if (props.isCurrentContextOnly === undefined && props.currentContextOnly === undefined) {
  console.error('ActionDropdownMenu: either `isCurrentContextOnly` or the deprecated `currentContextOnly` prop must be provided.')
}

const isCurrentContextOnly = props.isCurrentContextOnly || props.currentContextOnly === true

if (!isCurrentContextOnly) {
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
    :is-adaptive-content-width="true"
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
      >
        <template #bottom>
          <slot name="bottom" />
        </template>
      </ActionDropdownMenuContent>
    </template>
  </UIDropdownMenu>

  <slot
    v-else
    name="fallback"
  />
</template>
