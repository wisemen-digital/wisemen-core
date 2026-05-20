<script setup lang="ts">
import type { Action } from '@wisemen/vue-core-actions'
import { DotsVerticalIcon } from '@wisemen/vue-core-icons'
import { useSlots } from 'vue'
import { useI18n } from 'vue-i18n'

import ActionDropdownMenu from '@/ui/action-dropdown-menu/ActionDropdownMenu.vue'
import { UIBaseHeader } from '@/ui/base-header'
import type { BaseHeaderLeftConfig } from '@/ui/base-header/baseHeader.type'
import { UIIconButton } from '@/ui/button'

const props = withDefaults(defineProps<{
  title: string
  actions?: Action[]
  leftHeaderConfig?: BaseHeaderLeftConfig | null
}>(), {
  actions: () => [],
  leftHeaderConfig: null,
})

const i18n = useI18n()

const slots = useSlots()
</script>

<template>
  <header class="sticky top-0 z-1 py-4xl">
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0"
    >
      <div class="absolute inset-0 bg-linear-to-b from-primary to-transparent" />
      <div
        class="
          absolute inset-0
          mask-[linear-gradient(to_bottom,black_0%,transparent_100%)]
          backdrop-blur-xs
        "
      />
      <div
        class="
          absolute inset-0
          mask-[linear-gradient(to_bottom,black_0%,transparent_75%)]
          backdrop-blur-xs
        "
      />
      <div
        class="
          absolute inset-0
          mask-[linear-gradient(to_bottom,black_0%,transparent_50%)]
          backdrop-blur-sm
        "
      />
      <div
        class="
          absolute inset-0
          mask-[linear-gradient(to_bottom,black_0%,transparent_25%)]
          backdrop-blur-md
        "
      />
    </div>

    <UIBaseHeader
      :title="props.title"
      :left="props.leftHeaderConfig"
      class="relative"
    >
      <template
        v-if="slots.subtitle !== undefined"
        #subtitle
      >
        <slot name="subtitle" />
      </template>

      <template #actions>
        <slot name="actions" />

        <ActionDropdownMenu
          v-if="props.actions.length > 0"
          :actions="props.actions"
          :current-context-only="true"
          popover-side="bottom"
          popover-align="end"
        >
          <UIIconButton
            :label="i18n.t('component.dashboard_page_header.options')"
            :icon="DotsVerticalIcon"
            :is-tooltip-disabled="true"
            variant="tertiary"
          />
        </ActionDropdownMenu>
      </template>
    </UIBaseHeader>
  </header>
</template>
