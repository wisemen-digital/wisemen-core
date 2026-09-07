<script setup lang="ts">
import { RouterLink } from 'vue-router'

import type { RegisteredActionContext } from '@/register'
import { UIActionTrigger } from '@/ui/action-trigger/index'
import type { DataTableRowClick } from '@/ui/data-table/types/dataTableRowConfig.type'

const props = withDefaults(defineProps<{
  isRowLevel?: boolean
  ariaLabel?: string | null
  click?: DataTableRowClick | null
  model?: RegisteredActionContext['models'][number] | null
}>(), {
  isRowLevel: false,
  ariaLabel: null,
  click: null,
  model: null,
})
</script>

<template>
  <RouterLink
    v-if="props.click?.type === 'link'"
    :to="props.click.to"
    :aria-label="props.ariaLabel ?? undefined"
    :tabindex="props.isRowLevel ? undefined : -1"
    :class="{
      'pointer-events-none outline-none': props.isRowLevel,
    }"
    class="absolute inset-0 z-0"
  />

  <UIActionTrigger
    v-else-if="props.click?.type === 'action'"
    :action="props.click.action"
    :is-current-context-only="true"
    :models="props.model === null ? [] : [props.model]"
  >
    <template #default="{ canExecute }">
      <button
        :aria-label="props.ariaLabel ?? undefined"
        :disabled="!canExecute"
        :tabindex="props.isRowLevel ? undefined : -1"
        :class="{
          'pointer-events-none outline-none': props.isRowLevel,
        }"
        class="absolute inset-0 z-0"
        type="button"
      />
    </template>
  </UIActionTrigger>
</template>
