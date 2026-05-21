<script setup lang="ts">
import type {
  Action,
  ActionContext,
} from '@wisemen/vue-core-actions'
import {
  resolveActionAvatar,
  resolveActionBreadcrumbs,
  resolveActionHint,
  resolveActionName,
  resolveActionSelected,
} from '@wisemen/vue-core-actions'
import {
  CheckIcon,
  ChevronRightIcon,
} from '@wisemen/vue-core-icons'
import { ListboxItem } from 'reka-ui'
import type { Component } from 'vue'
import { computed } from 'vue'

import { UIAvatar } from '@/ui/avatar'
import { UIKeyboardShortcut } from '@/ui/keyboard-shortcut/index'
import { UIRowLayout } from '@/ui/row-layout/index'

const props = defineProps<{
  action: Action
  ctx: ActionContext
}>()

const emit = defineEmits<{
  select: []
}>()

const parentBreadcrumbs = computed(() => resolveActionBreadcrumbs(props.action, props.ctx))

const effectiveFirstBreadcrumbIcon = computed<Component | null>(() => {
  if (parentBreadcrumbs.value.length === 0) {
    return null
  }
  if (props.action.icon !== undefined) {
    return props.action.icon(props.ctx)
  }

  return parentBreadcrumbs.value[0]?.icon ?? null
})
</script>

<template>
  <ListboxItem
    :value="action.id"
    :data-id="action.id"
    class="
      flex cursor-default items-center justify-between rounded-md px-lg py-md
      text-xs
    "
    data-item
    @select="emit('select')"
  >
    <div class="flex items-center gap-x-xs">
      <span
        v-if="parentBreadcrumbs.length > 0"
        class="flex items-center gap-x-xs text-disabled"
      >
        <template
          v-for="(breadcrumb, breadcrumbIndex) of parentBreadcrumbs"
          :key="breadcrumbIndex"
        >
          <UIRowLayout gap="xs">
            <Component
              :is="effectiveFirstBreadcrumbIcon"
              v-if="effectiveFirstBreadcrumbIcon !== null && breadcrumbIndex === 0"
              class="size-3.5 text-tertiary"
            />

            <span>{{ breadcrumb.label }}</span>

            <ChevronRightIcon class="size-3 text-tertiary" />
          </UIRowLayout>
        </template>
      </span>

      <UIRowLayout gap="sm">
        <UIAvatar
          v-if="resolveActionAvatar(action, ctx) !== null"
          v-bind="resolveActionAvatar(action, ctx)!"
          size="xxs"
        />

        <Component
          :is="action.icon(ctx)"
          v-if="action.icon !== undefined && parentBreadcrumbs.length === 0"
          class="size-3.5 text-secondary"
        />

        <span class="text-secondary">
          {{ resolveActionName(action, ctx) }}
        </span>

        <span
          v-if="resolveActionHint(action, ctx)"
          class="text-disabled"
        >
          {{ resolveActionHint(action, ctx) }}
        </span>
      </UIRowLayout>
    </div>

    <CheckIcon
      v-if="resolveActionSelected(action, ctx)"
      class="size-3 text-primary"
    />

    <UIKeyboardShortcut
      v-if="action.keyboardShortcut !== undefined"
      :keyboard-shortcut="action.keyboardShortcut"
    />
  </ListboxItem>
</template>

<style>
[data-item][data-highlighted] {
  anchor-name: --a;
}

[data-content]::before {
  position-anchor: --a;
  inset: anchor(inside);
  transition:
    inset 0.1s
      linear(
        0 0%,
        0.2342 12.49%,
        0.4374 24.99%,
        0.6093 37.49%,
        0.6835 43.74%,
        0.7499 49.99%,
        0.8086 56.25%,
        0.8593 62.5%,
        0.9023 68.75%,
        0.9375 75%,
        0.9648 81.25%,
        0.9844 87.5%,
        0.9961 93.75%,
        1 100%
      ),
    opacity 0.2s ease;
  content: '';
  background: var(--bg-tertiary);
  position: absolute;
  pointer-events: none;
  z-index: -1;
  border-radius: var(--radius-md);
}
</style>
