<script setup lang="ts">
import type {
  Action,
  ActionContext,
} from '@wisemen/vue-core-actions'
import {
  resolveActionName,
  resolveApplicable,
  useActionManagerStore,
} from '@wisemen/vue-core-actions'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import type { RegisteredActionContext } from '@/register'
import Button from '@/ui/button/button/Button.vue'

const props = defineProps<{
  actions: Action[]
  metadata?: RegisteredActionContext['metadata']
  models?: RegisteredActionContext['models']
  selectedCount: number
}>()

const i18n = useI18n()
const manager = useActionManagerStore()

const context = computed<ActionContext>(() => manager.actionContext({
  menuType: 'contextualMenu',
  metadata: props.metadata,
  models: props.models ?? [],
}))

const applicableActions = computed<Action[]>(
  () => props.actions.filter((action) => resolveApplicable(action, context.value)),
)

function onExecute(action: Action): void {
  manager.executeAction(action, context.value)
}
</script>

<template>
  <div
    v-if="props.selectedCount > 0 && applicableActions.length > 0"
    class="
      absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-lg
      rounded-xl border border-secondary bg-primary px-xl py-lg shadow-lg
    "
  >
    <span class="text-xs font-medium text-secondary">
      {{ i18n.t('component.data_table.selection_action_bar.selected_count', props.selectedCount) }}
    </span>

    <Button
      v-for="action of applicableActions"
      :key="action.id"
      :disabled-reason="action.disabledReason?.(context) ?? null"
      :icon-left="action.icon?.(context) ?? null"
      :is-disabled="(action.disabledReason?.(context) ?? null) !== null"
      :label="resolveActionName(action, context)"
      size="sm"
      variant="secondary"
      @click="onExecute(action)"
    />
  </div>
</template>
