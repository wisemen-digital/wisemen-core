<script setup lang="ts">
import { useKeyHold } from '@tanstack/vue-hotkeys'
import type {
  Action,
  ActionContext,
  ActionModel,
} from '@wisemen/vue-core-actions'
import {
  resolveActionName,
  resolveActionSelected,
  resolveActionValue,
  useActionManagerStore,
} from '@wisemen/vue-core-actions'
import { CheckIcon } from '@wisemen/vue-core-icons'
import type { Component } from 'vue'
import { computed } from 'vue'

import ActionDropdownMenuContent from '@/ui/action-dropdown-menu/ActionDropdownMenuContent.vue'
import {
  UIDropdownMenuItem,
  UIDropdownMenuSub,
  UIDropdownMenuSubContent,
  UIDropdownMenuSubTrigger,
} from '@/ui/dropdown-menu/index'
import type { MenuItemLeftConfig } from '@/ui/menu-item/menuItem.type'

const props = defineProps<{
  action: Action
  closeOnSelect: boolean
  context?: ActionContext
  models?: ActionModel[]
  preview?: Component | null
}>()

const manager = useActionManagerStore()
const isShiftKeyHeld = useKeyHold('Shift')

const context = computed<ActionContext>(() => props.context ?? manager.actionContext({}))

const label = computed<string>(() => resolveActionName(props.action, context.value))
const actionHasSubActions = computed<boolean>(() => props.action.subActions !== undefined)

const parentLabel = computed<string | null>(() => {
  const parent = props.action.parentAction

  if (parent === undefined) {
    return null
  }

  return parent.nameAsParent !== undefined
    ? resolveActionValue(parent.nameAsParent, context.value)
    : resolveActionName(parent, context.value)
})

const isApplicable = computed<boolean>(() => {
  return props.action.isApplicable === undefined || props.action.isApplicable(context.value)
})

const disabledReason = computed<string | null>(() => {
  return props.action.disabledReason?.(context.value) ?? null
})

const isSelected = computed<boolean>(() => {
  return resolveActionSelected(props.action, context.value) === true
})

const icon = computed<Component | null>(
  () => props.action.icon === undefined ? null : props.action.icon(context.value),
)

const itemLeft = computed<MenuItemLeftConfig | null>(() => {
  if (parentLabel.value !== null) {
    return {
      breadcrumbs: [
        {
          icon: icon.value,
          label: parentLabel.value,
        },
      ],
      type: 'breadcrumbs',
    } as MenuItemLeftConfig
  }

  if (icon.value !== null) {
    return {
      icon: icon.value,
      type: 'icon',
    }
  }

  return null
})

function onSelectAction(event: Event): void {
  if (!props.closeOnSelect || isShiftKeyHeld.value) {
    event.preventDefault()
  }

  manager.executeAction(props.action, context.value)
}
</script>

<template>
  <UIDropdownMenuSub v-if="actionHasSubActions">
    <UIDropdownMenuSubTrigger
      :label="label"
      :config="{
        left: icon === null || parentLabel !== null
          ? undefined : {
            type: 'icon',
            icon,
          },
      }"
    />
    <UIDropdownMenuSubContent>
      <ActionDropdownMenuContent
        :models="props.models ?? []"
        :parent-action="props.action"
      />
    </UIDropdownMenuSubContent>
  </UIDropdownMenuSub>

  <UIDropdownMenuItem
    v-if="isApplicable && props.action.execute !== undefined"
    :label="label"
    :config="{
      left: itemLeft,
      right: isSelected ? {
        icon: CheckIcon,
        type: 'icon',
      } : props.action.keyboardShortcut === undefined ? undefined : {
        type: 'shortcut',
        keyboardShortcut: props.action.keyboardShortcut,
      },
    }"
    :disabled-reason="disabledReason"
    @select="onSelectAction"
  />
</template>
